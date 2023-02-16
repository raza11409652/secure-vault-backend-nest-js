import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Body,
  Req,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { AuthSessionPayload } from 'src/types/auth';
import { SessionAuthGuard } from 'src/auth/guard/session.auth.guard';
import { generateBcryptHash } from 'src/helper/bcrypt';
import { TeamCreate, TeamQuery } from '../dto/team';
import { TeamService } from '../service/team.service';
import { Types } from 'mongoose';
import { getPagination, getPaginationData } from 'src/utils/string.handler';
import { TeamInviteService } from '../service/team.invite.service';
import { appConfig } from 'src/config/app';
@Controller('teams')
@UseGuards(SessionAuthGuard)
export class TeamController {
  constructor(
    private readonly team: TeamService,
    private readonly invite: TeamInviteService,
  ) {}
  @Post('/')
  async handleTeamCreation(
    @Body() body: TeamCreate,
    @Req() req: { [key: string]: any },
  ) {
    try {
      const sessionPayload: AuthSessionPayload = req.payload || null;
      //   console.log({ sessionPayload });
      if (sessionPayload?.role !== 'ADMIN')
        throw new HttpException('Invalid request', HttpStatus.FORBIDDEN);
      const masterPassword = generateBcryptHash(body.password);
      const d = await this.team.newTeam({
        ...body,
        masterPassword,
        createdBy: new Types.ObjectId(sessionPayload.id),
      });
      return { id: d._id };
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/invite/:id')
  async handleTeamInvite(
    @Req() req: { [key: string]: any },
    @Param('id') id: Types.ObjectId,
  ) {
    try {
      if (Types.ObjectId.isValid(id) === false)
        throw new Error('Invalid request');
      const sessionPayload: AuthSessionPayload = req.payload || null;
      //   console.log({ sessionPayload });
      // if (sessionPayload?.role !== 'ADMIN')
      //   throw new HttpException('Invalid request', HttpStatus.FORBIDDEN);
      const teamData = await this.team.getTeamById(new Types.ObjectId(id));
      if (!teamData) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      if (sessionPayload.role === 'ADMIN') {
        if (String(teamData.createdBy) !== sessionPayload.id)
          throw new Error('Invalid team id');
      } else {
        if (sessionPayload.t !== String(teamData._id))
          throw new Error('Invalid team id');
      }
      const invite = await this.invite.insertNewTeamInvite({
        user: new Types.ObjectId(sessionPayload.id),
        team: teamData._id,
      });
      const URL = `${appConfig.frontEndURL}register?team=${invite.id}`;
      return URL;
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/')
  async handleTeamList(
    @Req() req: { [key: string]: any },
    @Query() { page, size }: TeamQuery,
  ) {
    try {
      const sessionPayload: AuthSessionPayload = req.payload || null;
      //   console.log({ sessionPayload });
      if (sessionPayload?.role !== 'ADMIN')
        throw new HttpException('Invalid request', HttpStatus.FORBIDDEN);
      const { limit, skip } = getPagination(page, size);
      const response = await this.team.getTeams(
        {
          createdBy: new Types.ObjectId(sessionPayload.id),
        },
        limit,
        skip,
      );
      const record = getPaginationData(
        response.count,
        page,
        limit,
        response.teams,
      );
      return record;
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
