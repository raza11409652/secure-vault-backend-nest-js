import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamDocument, Teams } from '../schema/team.schema';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Teams.name) private readonly team: Model<TeamDocument>,
  ) {}
  async newTeam(param: { [key: string]: any }) {
    try {
      const x = new this.team(param);
      return await x.save();
    } catch (e) {
      throw e;
    }
  }

  async getTeams(filter: { [key: string]: any }, limit: number, skip: number) {
    const t = this.team
      .find(filter, { masterPassword: 0 })
      .limit(limit)
      .skip(skip);
    const c = this.team.count(filter);
    const [teams, count] = await Promise.all([t, c]);
    return { teams, count };
  }

  async getTeamById(id: Types.ObjectId, o?: { [key: string]: any }) {
    return await this.team.findById(id, o);
  }
  async getAllTeams(id: Types.ObjectId) {
    const x = await this.team.find({ createdBy: id });
    return x.map((a) => a._id);
  }
  async updateTeamById(id: Types.ObjectId, option: { [key: string]: any }) {
    return await this.team.findByIdAndUpdate(id, { ...option }, { new: true });
  }
}
