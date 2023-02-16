import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Teams, TeamSchema } from 'src/teams/schema/team.schema';
import { TeamService } from 'src/teams/service/team.service';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { UserService } from 'src/users/service/user.service';
import { SecureVaultController } from './controller/vault.controller';
import { SecureVault, SecureVaultSchema } from './schema/secure.vault.schema';
import { VaultService } from './service/vault.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SecureVault.name, schema: SecureVaultSchema },
      { name: Teams.name, schema: TeamSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SecureVaultController],
  exports: [],
  providers: [VaultService, TeamService, UserService],
})
export class SecureVaultModule {}
