import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/guard/session.auth.guard';
import { AuthSessionPayload } from 'src/types/auth';
import { getPagination, getPaginationData } from 'src/utils/string.handler';
import { GetUsers } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { Types } from 'mongoose';
import { TeamService } from 'src/teams/service/team.service';
@Controller('user')
@UseGuards(SessionAuthGuard)
export class UserController {
  constructor(
    private readonly user: UserService,
    private readonly team: TeamService,
  ) {}
  @Get('/')
  async handleUserListing(
    @Req() req: { [key: string]: any },
    @Query() { page, size, team }: GetUsers,
  ) {
    try {
      const sessionPayload: AuthSessionPayload = req.payload || null;
      let filter =
        sessionPayload.role === 'USER'
          ? { team: new Types.ObjectId(sessionPayload.t) }
          : {};
      if (sessionPayload.role === 'ADMIN' && !team)
        throw new Error('Team is required');
      if (team && sessionPayload.role === 'ADMIN') {
        const teamData = await this.team.getTeamById(new Types.ObjectId(team));
        if (!teamData) throw new Error('Team data not found');
        filter = { ...filter, team: teamData?._id };
      }
      console.log({ filter });
      const { limit, skip } = getPagination(page, size);
      const { records, count } = await this.user.getUserRecords(
        filter,
        limit,
        skip,
      );
      const response = getPaginationData(count, page, limit, records);
      return response;
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
