import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Teams, TeamSchema } from 'src/teams/schema/team.schema';
import { TeamService } from 'src/teams/service/team.service';
import { UserController } from './controller/user.controller';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './service/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Teams.name, schema: TeamSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, TeamService],
  exports: [UserService],
})
export class UserModule {}
