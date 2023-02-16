import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TeamInvite,
  TeamInviteSchema,
} from 'src/teams/schema/team.invite.schema';
import { Teams, TeamSchema } from 'src/teams/schema/team.schema';
import { TeamInviteService } from 'src/teams/service/team.invite.service';
import { TeamService } from 'src/teams/service/team.service';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { UserService } from 'src/users/service/user.service';
import { AuthController } from './controller/auth';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Teams.name, schema: TeamSchema },
      { name: TeamInvite.name, schema: TeamInviteSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [UserService, TeamService, TeamInviteService],
})
export class AuthModule {}
