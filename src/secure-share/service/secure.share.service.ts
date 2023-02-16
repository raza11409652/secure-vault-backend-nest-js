import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SecureShare,
  SecureShareDocument,
} from '../schema/secure.share.schema';

@Injectable()
export class SecureShareService {
  constructor(
    @InjectModel(SecureShare.name)
    private readonly secureShare: Model<SecureShareDocument>,
  ) {}

  async newShareContent(params: { [key: string]: any }) {
    try {
      const x = new this.secureShare(params);
      return await x.save();
    } catch (e) {
      throw e;
    }
  }
  async getShareContentData(filter: { [key: string]: any }) {
    try {
      // const x = new this.secureShare(params);
      return await this.secureShare.findOne(filter);
    } catch (e) {
      throw e;
    }
  }

  async incrementViewCount(id: Types.ObjectId) {
    return await this.secureShare.findByIdAndUpdate(id, {
      $inc: { viewCount: 1 },
    });
  }

  async getList(f: { [key: string]: any }, limit: number, skip: number) {
    const r = this.secureShare
      .find(f, {
        url: 1,
        maxViewAllowed: 1,
        viewCount: 1,
        findingKey: 1,
        createdAt: 1,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    const c = this.secureShare.count(f);
    const [records, count] = await Promise.all([r, c]);
    return { records, count };
  }
}
