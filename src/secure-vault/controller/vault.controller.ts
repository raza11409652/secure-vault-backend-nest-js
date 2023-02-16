import {
  Post,
  Body,
  HttpException,
  HttpStatus,
  Controller,
  Param,
  Query,
} from '@nestjs/common';
import { decryptText, encryptText } from 'src/helper/encryption';
import {
  getNanoId,
  getPagination,
  getPaginationData,
} from 'src/utils/string.handler';
import { GetVault, SecureVaultDTO, SecureVaultPwd } from '../dto/vault';
import { SecureLock } from '../schema/secure.vault.schema';
import { VaultService } from '../service/vault.service';
import { Types } from 'mongoose';
import { SingleVaultResponseDecrypt } from 'src/types/vault';
import { Get, Req, UseGuards } from '@nestjs/common/decorators';
import { SessionAuthGuard } from 'src/auth/guard/session.auth.guard';
import { AuthSessionPayload } from 'src/types/auth';
import { TeamService } from 'src/teams/service/team.service';
import { compareBcryptHash } from 'src/helper/bcrypt';
import { UserService } from 'src/users/service/user.service';
@Controller('vault')
@UseGuards(SessionAuthGuard)
export class SecureVaultController {
  constructor(
    private readonly vault: VaultService,
    private readonly team: TeamService,
    private readonly user: UserService,
  ) {}
  @Post('/')
  async createSecureVault(
    @Body() body: SecureVaultDTO,
    @Req() req: { [key: string]: any },
  ) {
    try {
      const sessionPayload: AuthSessionPayload = req.payload || null;
      const encryptionKey = getNanoId(32);
      let secureLock: SecureLock = { encKey: encryptionKey };
      // console.log({ sessionPayload });

      if (sessionPayload.role === 'ADMIN') {
        const data = await this.team.getTeamById(new Types.ObjectId(body.team));
        if (
          String(data?._id) !== body.team ||
          String(data?.createdBy) !== sessionPayload.id
        )
          throw new Error('Invalid team selection');
      } else {
        if (sessionPayload.t !== body.team)
          throw new HttpException('Not allowed', HttpStatus.BAD_REQUEST);
      }
      if (body.type === 'PASSWORD') {
        if (!body.url) throw new Error('URL is required');
        if (!body.username) throw new Error('Username is required');
        if (!body.password) throw new Error('Password is required');
        const Password = encryptText(body.password, encryptionKey);
        const Username = encryptText(body.username, encryptionKey);
        // console.log(Password, Username);
        body.password = Password.content;
        body.username = Username.content;
        secureLock = {
          ...secureLock,
          password: Password.iv,
          username: Username.iv,
        };
      } else if (body.type === 'NOTES') {
        if (!body.notes) throw new Error('Notes is required');
      }
      if (body.notes && body.notes.trim().length > 1) {
        const Notes = encryptText(body.notes, encryptionKey);
        secureLock = {
          ...secureLock,
          notes: Notes.iv,
        };
        body.notes = Notes.content;
      }
      if (body.users && body.users.length > 0) {
        if (body.users.length > 10) throw new Error('Max 10 users allowed');
        for (const e of body.users) {
          if (Types.ObjectId.isValid(e) === false)
            throw new Error('Invalid id passed');
        }
        const filter = {
          _id: { $in: body.users.map((a) => new Types.ObjectId(a)) },
          team: new Types.ObjectId(body.team),
        };
        const records = await this.user.getUsers(filter);
        if (records.length !== body.users.length)
          throw new Error('Invalid users selections');
      }
      const data = await this.vault.insertNewVault({
        ...body,
        secureLock,
        user: new Types.ObjectId(sessionPayload.id),
        ...(body.users &&
          body.users.length > 0 && {
            users: body.users.map((a) => new Types.ObjectId(a)),
            visibility: 'CUSTOM',
          }),
        team: new Types.ObjectId(body.team),
      });
      return { data: data._id };
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:id')
  async handleVaultDecryption(
    @Param('id') id: Types.ObjectId,
    @Body() body: SecureVaultPwd,
    @Req() req: { [key: string]: any },
  ) {
    try {
      if (Types.ObjectId.isValid(id) === false)
        throw new Error('Invalid request');
      const sessionPayload: AuthSessionPayload = req.payload || null;

      const data = await this.vault.getVaultById(id);
      if (!data) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      if (data.masterPasswordRequired && sessionPayload.role === 'USER') {
        const teamData = await this.team.getTeamById(data.team);
        if (!teamData) throw new Error('Invalid request');
        if (!body.password) throw new Error('Password is required');
        const flag = compareBcryptHash(body.password, teamData.masterPassword);
        if (!flag)
          throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }

      const response: SingleVaultResponseDecrypt = {
        name: data.name,
        type: data.type,
      };
      if (data.type === 'PASSWORD') {
        response.password = decryptText(
          data.secureLock.password || '',
          data.password,
          data.secureLock.encKey,
        );
        response.username = decryptText(
          data.secureLock.username || '',
          data.username,
          data.secureLock.encKey,
        );
        response.url = data.url;
      }
      if (data.notes && data.notes.trim().length > 0) {
        response.notes = decryptText(
          data.secureLock.notes || '',
          data.notes,
          data.secureLock.encKey,
        );
      } else {
        response.notes = '';
      }
      return response;
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/')
  async handleVaultListing(
    @Req() req: { [key: string]: any },
    @Query() { page, size }: GetVault,
  ) {
    try {
      const { limit, skip } = getPagination(page, size);
      const sessionPayload: AuthSessionPayload = req.payload || null;
      let filter: { [key: string]: any } = {};
      if (sessionPayload.role === 'ADMIN') {
        const teams = await this.team.getAllTeams(
          new Types.ObjectId(sessionPayload.id),
        );
        filter = { ...filter, team: { $in: teams } };
      } else {
        filter = {
          ...filter,
          $or: [
            {
              team: new Types.ObjectId(sessionPayload.t),
              visibility: 'ALL',
            },
            {
              visibility: 'CUSTOM',
              users: { $in: [new Types.ObjectId(sessionPayload.id)] },
            },
            { user: new Types.ObjectId(sessionPayload.id) },
          ],
        };
      }
      const { records, count } = await this.vault.getList(filter, limit, skip);
      const response = getPaginationData(count, page, limit, records);
      return { ...response, filter };
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
