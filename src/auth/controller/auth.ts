import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { compareBcryptHash, generateBcryptHash } from 'src/helper/bcrypt';
import { generateSessionToken } from 'src/helper/jwt';
import { TeamService } from 'src/teams/service/team.service';
import { UserService } from 'src/users/service/user.service';
import { AuthLogin, AuthRegister } from '../dto/auth.dto';
import { Types } from 'mongoose';
import { TeamInviteService } from 'src/teams/service/team.invite.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly user: UserService,
    private readonly team: TeamService,
    private readonly invite: TeamInviteService,
  ) {}
  @Post('register')
  async handleRegister(@Body() body: AuthRegister) {
    try {
      const userData = await this.user.getUserDataByEmail(body.email);
      if (userData)
        throw new HttpException('Email already used', HttpStatus.BAD_REQUEST);
      let invite = null;
      if (body.team) {
        // teamData = await this.team.getTeamById(new Types.ObjectId(body.team));
        invite = await this.invite.getInviteDetails(
          new Types.ObjectId(body.team),
        );
        if (!invite || invite?.status !== 'CREATED')
          throw new Error('Look like your invitation has been expired');
      }
      body.password = generateBcryptHash(body.password);
      const data = await this.user.InsertNew({
        ...body,
        ...(body.team &&
          invite && {
            role: 'USER',
            team: invite.team,
          }),
      });
      if (invite) {
        await this.invite.updateTeamInvite(invite._id, { status: 'USED' });
      }
      return data._id;
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Post('login')
  async handleLogin(@Body() body: AuthLogin) {
    try {
      const userData = await this.user.getUserDataByEmail(body.email);
      if (!userData)
        throw new HttpException('Auth failed', HttpStatus.BAD_REQUEST);
      const flag = compareBcryptHash(body.password, userData.password);
      if (!flag) throw new HttpException('Auth failed', HttpStatus.BAD_REQUEST);
      const token = generateSessionToken({
        id: userData._id,
        email: userData.email,
        role: userData.role,
        ...(userData.role === 'USER' && { t: String(userData.team) }),
      });
      const profile = await this.user.getUserById(userData._id);
      return { token, profile };
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
