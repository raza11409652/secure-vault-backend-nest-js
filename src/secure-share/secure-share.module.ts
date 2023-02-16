import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SecureShareController } from './controller/secure.share.controller';
import { SecureShare, SecureShareSchema } from './schema/secure.share.schema';
import { SecureShareService } from './service/secure.share.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SecureShare.name, schema: SecureShareSchema },
    ]),
  ],
  controllers: [SecureShareController],
  providers: [SecureShareService],
})
export class SecureShareModule {}
