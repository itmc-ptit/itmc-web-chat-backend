import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';

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

  async update(token: string, payload: UpdateUserDto): Promise<UserDocument> {
    const requestedUserId = payload.id;
    if (!requestedUserId) {
      throw new BadRequestException('User ID is required');
    }

    // ? Why the claim should be {id, email} but received {sub, email}?
    const claim = await this.extractToken(token);
    console.log(claim);
    if (claim.sub != requestedUserId) {
      throw new BadRequestException('Unauthorized');
    }

    const user = await this.findById(requestedUserId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // * Update the username if changes happened to the first name or last name
    let username: string = user.username;
    if (
      payload.firstName != user.firstName ||
      payload.lastName != user.lastName
    ) {
      username = await this.getUsername(payload.firstName, payload.lastName);
    }

    let password: string = user.password;
    const passwordMatches = await argon2.verify(
      user.password,
      payload.password,
    );
    if (!passwordMatches) {
      password = await argon2.hash(payload.password);
    }

    return await this.userModel
      .findByIdAndUpdate(
        requestedUserId,
        {
          ...payload,
          username: username,
          password: password,
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

  private async extractToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return decoded;
    } catch (err) {
      return err;
    }
  }
}
