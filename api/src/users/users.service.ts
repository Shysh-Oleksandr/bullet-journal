import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByUid(uid: string): Promise<User | null> {
    return this.userModel.findOne({ uid }).exec();
  }

  async create(userData: Partial<User>) {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async update(uid: string, userData: Partial<User>) {
    return this.userModel.updateOne({ uid }, { $set: userData }).exec();
  }
}
