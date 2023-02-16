import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class TeamCreate {
  @IsString()
  name: string;
  @IsString()
  password: string;
}

export class TeamQuery {
  @IsNumber()
  @Type(() => Number)
  size: number;
  @IsNumber()
  @Type(() => Number)
  page: number;
}
