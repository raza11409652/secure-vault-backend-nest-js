import { Type } from 'class-transformer';
import {
  IsArray,
  IsBase64,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class SecureVaultDTO {
  @IsString()
  name: string;
  @IsString()
  type: 'PASSWORD' | 'NOTES';
  @IsOptional()
  @IsUrl()
  url: string;
  @IsOptional()
  @IsString()
  //   @IsAlphanumeric()
  username: string;
  @IsOptional()
  @IsString()
  password: string;
  @IsString()
  @IsOptional()
  @MaxLength(512)
  notes: string;
  @IsOptional()
  @IsBase64()
  fileAttachment: string;

  @IsMongoId()
  team: string;

  @IsArray()
  @IsOptional()
  users: Array<Types.ObjectId>;
}

export class SecureVaultPwd {
  @IsString()
  @IsOptional()
  password: string;
}

export class GetVault {
  @IsNumber()
  @Type(() => Number)
  size: number;
  @IsNumber()
  @Type(() => Number)
  page: number;
}
