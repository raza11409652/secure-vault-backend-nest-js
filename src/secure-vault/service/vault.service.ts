import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import {
  SecureVault,
  SecureVaultDocument,
} from '../schema/secure.vault.schema';

export class VaultService {
  constructor(
    @InjectModel(SecureVault.name)
    private readonly vault: Model<SecureVaultDocument>,
    @InjectModel(User.name)
    private readonly user: Model<UserDocument>,
  ) {}

  async insertNewVault(param: { [key: string]: any }) {
    try {
      const x = new this.vault(param);
      return await x.save();
    } catch (e) {
      throw e;
    }
  }
  async getVaultById(id: Types.ObjectId) {
    return await this.vault.findById(id);
  }
  async getList(filter: { [key: string]: any }, limit: number, skip: number) {
    const v = this.vault
      .find({ ...filter }, { name: 1, type: 1, url: 1, visibility: 1, user: 1 })
      .populate('user', ['firstName', 'email'], this.user)
      .populate('users', ['firstName', 'email'], this.user)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .allowDiskUse(true)
      .lean();
    const c = this.vault.count(filter);
    const [records, count] = await Promise.all([v, c]);
    return { records, count };
  }
}
