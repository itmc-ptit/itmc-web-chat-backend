import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
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
      throw new Error('Email already exists');
    }

    const username: string = createUserDto.firstName
      .toLowerCase()
      .trim()
      .replace(' ', '-')
      .concat(createUserDto.lastName.toLowerCase().trim().replace(' ', '-'))
      .concat(Date.now().toString());

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

  async findOne(id: string): Promise<UserDocument> {
    return await this.userModel
      .findById({
        _id: id,
        deleteAt: null,
      })
      .exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById({
      _id: id,
      deleteAt: null,
    });
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email: email, deleteAt: null });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.userModel
      .findByIdAndUpdate(id, {
        ...updateUserDto,
        updatedAt: Date.now(),
      })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, {
        updatedAt: Date.now(),
      })
      .exec();
  }
}
