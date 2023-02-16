import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<UserDocument>,
  ) {}
  /**
   * Insert new user
   * @param params
   * @returns
   */
  async InsertNew(params: { [key: string]: any }) {
    try {
      const x = new this.user(params);
      return await x.save();
    } catch (e) {
      throw e;
    }
  }

  async getUserDataByEmail(email: string) {
    return await this.user.findOne({ email });
  }
  async getUserById(id: Types.ObjectId) {
    return await this.user.findById(id, { password: 0 }).lean();
  }
  async getUsers(filter: { [key: string]: any }) {
    return await this.user.find(filter).lean();
  }
  async getUserRecords(
    filter: { [key: string]: any },
    limit: number,
    skip: number,
  ) {
    const c = this.user.count(filter);
    const r = this.user
      .find(filter, { password: 0 })
      .limit(limit)
      .skip(skip)
      .sort({ firstName: 1 })
      .allowDiskUse(true);
    const [count, records] = await Promise.all([c, r]);
    return { count, records };
  }
}
