import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
  ) {}
  async createUser(
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    gender: string,
    dob: Date,
  ): Promise<User> {
    return this.userModel.create({
      email,
      password,
      first_name,
      last_name,
      gender,
      dob,
    });
  }
  async getUser(query: object): Promise<User> {
    return this.userModel.findOne(query);
  }
}
