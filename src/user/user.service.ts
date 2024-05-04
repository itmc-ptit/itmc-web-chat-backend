import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async update(id: string, payload: UpdateUserDto): Promise<UserDocument> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    let username: string = user.username;
    if (
      payload.firstName != user.firstName ||
      payload.lastName != user.lastName
    ) {
      username = await this.getUsername(payload.firstName, payload.lastName);
    }

    return await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...payload,
          username: username,
          updatedAt: Date.now(),
        },
        { new: true },
      )
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

  async remove(id: string): Promise<UserDocument> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return await this.userModel
      .findByIdAndUpdate(
        id,
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
