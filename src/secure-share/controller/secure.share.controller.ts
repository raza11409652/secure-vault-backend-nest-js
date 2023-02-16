import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
// import { Query, Req } from '@nestjs/common/decorators';
import { SessionAuthGuard } from 'src/auth/guard/session.auth.guard';
import { compareBcryptHash, generateBcryptHash } from 'src/helper/bcrypt';
import { decryptText, encryptText } from 'src/helper/encryption';
import { AuthSessionPayload } from 'src/types/auth';
import {
  getNanoId,
  getPagination,
  getPaginationData,
} from 'src/utils/string.handler';
import { SecureShareDto, SecureShareListing } from '../dto/secure.share';
import { SecureShareService } from '../service/secure.share.service';
import { Types } from 'mongoose';
import { appConfig } from 'src/config/app';
@Controller('secure-share')
export class SecureShareController {
  constructor(private readonly share: SecureShareService) {}
  @UseGuards(SessionAuthGuard)
  @Post('/')
  async handleNewShareContent(
    @Body() body: SecureShareDto,
    @Req() req: { [key: string]: any },
  ) {
    try {
      const sessionPayload: AuthSessionPayload = req.payload || null;
      const findingKey = getNanoId(10) + Math.round(Math.random() * 100);
      const encryptionKey = 'E' + getNanoId(31);
      const encryptedContent = encryptText(body.content, encryptionKey);
      const URL = `${appConfig.frontEndURL}/view-content/${findingKey}-${encryptionKey}`;
      const params = {
        content: encryptedContent.content,
        key: generateBcryptHash(encryptionKey),
        findingKey,
        keyIV: encryptedContent.iv,
        url: URL,
        user: new Types.ObjectId(sessionPayload.id),
      };

      const data = await this.share.newShareContent(params);
      return { url: data.url };
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(SessionAuthGuard)
  @Get('/')
  async handleListShareContent(
    @Req() req: { [key: string]: any },
    @Query() { page, size }: SecureShareListing,
  ) {
    try {
      const sessionPayload: AuthSessionPayload = req.payload || null;
      const { limit, skip } = getPagination(page, size);
      const { records, count } = await this.share.getList(
        { user: new Types.ObjectId(sessionPayload.id) },
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

  @Get('/:key')
  async handleGetView(@Param('key') key: string) {
    try {
      const hashes = key.split('-');
      if (hashes.length !== 2)
        throw new Error('Invalid request  OR URL expired');
      const findingKey = hashes[0];
      const encryptionKey = hashes[1];
      const data = await this.share.getShareContentData({ findingKey });
      if (!data) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      if (!compareBcryptHash(encryptionKey, data.key)) {
        throw new HttpException('URL is broken', HttpStatus.BAD_REQUEST);
      }
      if (data.viewCount >= data.maxViewAllowed) {
        throw new HttpException('URL is expired', HttpStatus.FORBIDDEN);
      }
      const decrypt = decryptText(data.keyIV, data.content, encryptionKey);
      await this.share.incrementViewCount(data._id);
      return { content: decrypt };
    } catch (e) {
      throw new HttpException(
        e?.['message'] || 'Error',
        e?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
