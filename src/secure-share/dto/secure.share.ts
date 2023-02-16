import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SecureShareDto {
  @IsString()
  content: string;
}

export class SecureShareListing {
  @IsNumber()
  @Type(() => Number)
  page: number;
  @IsNumber()
  @Type(() => Number)
  size: number;
}
