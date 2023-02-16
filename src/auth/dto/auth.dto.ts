import { IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';

export class AuthLogin {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class AuthRegister {
  @IsEmail()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  password: string;
  @IsOptional()
  @IsMongoId()
  team: string;
}

// export
