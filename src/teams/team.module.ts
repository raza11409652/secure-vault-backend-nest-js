import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { UserService } from 'src/users/service/user.service';
import { TeamController } from './controller/team.controller';
import { TeamInvite, TeamInviteSchema } from './schema/team.invite.schema';
import { Teams, TeamSchema } from './schema/team.schema';
import { TeamInviteService } from './service/team.invite.service';
import { TeamService } from './service/team.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Teams.name, schema: TeamSchema },
      {
        name: TeamInvite.name,
        schema: TeamInviteSchema,
      },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamInviteService, UserService],
  exports: [TeamService, TeamInviteService],
})
export class TeamModule {}
