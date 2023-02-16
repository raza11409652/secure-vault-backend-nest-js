import { Type } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class GetUsers {
  @IsNumber()
  @Type(() => Number)
  page: number;
  @IsNumber()
  @Type(() => Number)
  size: number;
  @IsOptional()
  @IsMongoId()
  team: string;
}
