import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { RemoveUserDto } from './dto/remove-user.dto';
import { toGender } from './entities/gender.enum';
import { UserStatus } from './entities/user-status.enum';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const username: string = await this.getUsername(
      createUserDto.firstName,
      createUserDto.lastName,
    );

    return await new this.userModel({
      ...createUserDto,
      status: UserStatus.Active,
      username: username,
      createAt: Date.now(),
      updatedAt: Date.now(),
      deleteAt: null,
    }).save();
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel
      .find({
        deleteAt: null,
      })
      .exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return await this.userModel.findOne({
      _id: id,
      deleteAt: null,
    });
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email: email, deleteAt: null });
  }

  async update(userId: string, payload: UpdateUserDto): Promise<UserDocument> {
    const updatingUserId = payload.id;
    if (userId !== updatingUserId) {
      throw new BadRequestException('Unauthorized! User not allowed to update');
    }

    const user = await this.findById(updatingUserId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const updatedUser: Partial<UserDocument> = {
      updateAt: new Date(),
    };

    if (payload.firstName !== user.firstName) {
      updatedUser.firstName = payload.firstName;
      updatedUser.username = await this.getUsername(
        updatedUser.firstName,
        user.lastName,
      );
    }

    if (payload.lastName !== user.lastName) {
      updatedUser.lastName = payload.lastName;
      updatedUser.username = await this.getUsername(
        updatedUser.firstName,
        payload.lastName,
      );
    }

    const passwordMatches = await argon2.verify(
      user.password,
      payload.password,
    );
    if (!passwordMatches) {
      updatedUser.password = await argon2.hash(payload.password);
    }

    if (payload.gender !== user.gender.toString()) {
      updatedUser.gender = toGender(payload.gender);
    }

    if (payload.dateOfBirth !== user.dateOfBirth) {
      updatedUser.dateOfBirth = new Date(payload.dateOfBirth);
    }

    return await this.userModel
      .findByIdAndUpdate(updatingUserId, updatedUser, { new: true })
      .exec();
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<UserDocument> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return await this.userModel
      .findByIdAndUpdate(id, {
        refreshToken: refreshToken,
        updatedAt: Date.now(),
      })
      .exec();
  }

  async updateStatus(
    userIdFromToken: string,
    payload: UpdateUserStatusDto,
  ): Promise<UserDocument> {
    const user: UserDocument = await this.findById(payload.id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (userIdFromToken !== payload.id) {
      throw new BadRequestException('Unauthorized! User not allowed to update');
    }

    return await this.userModel
      .findByIdAndUpdate(
        payload.id,
        {
          status: payload.status,
          updatedAt: Date.now(),
        },
        { new: true },
      )
      .exec();
  }

  async remove(payload: RemoveUserDto): Promise<UserDocument> {
    const user = await this.findById(payload.id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return await this.userModel
      .findByIdAndUpdate(
        payload.id,
        {
          updatedAt: Date.now(),
          deleteAt: Date.now(),
        },
        { new: true },
      )
      .exec();
  }

  private async getUsername(
    firstName: string,
    lastName: string,
  ): Promise<string> {
    return firstName
      .toLowerCase()
      .trim()
      .replace(' ', '-')
      .concat(lastName.toLowerCase().trim().replace(' ', '-'))
      .concat(Date.now().toString());
  }
}
