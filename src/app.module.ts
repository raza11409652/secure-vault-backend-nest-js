import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { database } from './config/database';
import { SecureShareModule } from './secure-share/secure-share.module';
import { SecureVaultModule } from './secure-vault/secure.vault.module';
import { TeamModule } from './teams/team.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${database.host}:${database.port}`, {
      user: database.user,
      pass: database.password,
      dbName: database.database,
      connectionFactory: (connection) => {
        // console.log(connection);
        connection.on('connected', () => {
          console.log('is connected');
        });
        connection.on('disconnected', () => {
          console.log('DB disconnected');
        });
        connection.on('error', (error: any) => {
          console.log('DB connection failed! for error: ', error);
        });
        return connection;
      },
    }),
    AuthModule,
    SecureShareModule,
    SecureVaultModule,
    TeamModule,
    UserModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
