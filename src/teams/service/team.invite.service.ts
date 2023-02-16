import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamInvite, TeamInviteDocument } from '../schema/team.invite.schema';

export class TeamInviteService {
  constructor(
    @InjectModel(TeamInvite.name)
    private readonly invite: Model<TeamInviteDocument>,
  ) {}
  async insertNewTeamInvite(option: { [key: string]: any }) {
    try {
      const x = new this.invite(option);

      return await x.save();
    } catch (e) {
      throw e;
    }
  }
  /**
   *
   * @param id
   * @returns
   */
  async getInviteDetails(id: Types.ObjectId) {
    try {
      return await this.invite.findById(id);
    } catch (e) {
      throw e;
    }
  }

  async updateTeamInvite(id: Types.ObjectId, option: { [key: string]: any }) {
    return await this.invite.findByIdAndUpdate(id, option);
  }
}
