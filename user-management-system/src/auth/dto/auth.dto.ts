import { Transform } from '@nestjs/class-transformer';
import { IsNumber } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'The first name of the use',
  })
  first_name: string;

  @ApiProperty({
    description: 'The last name of the user',
  })
  last_name: string;

  @ApiProperty({
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    description: 'the phone no of the user',
    required: false,
  })
  phone_no: number;

  @ApiProperty({
    description: 'The password of the user',
  })
  password: string;

  @ApiProperty({
    description: 'confirm password',
  })
  confirm_password: string;

  @ApiProperty({
    description: 'The role of the user',
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  role_id: number;

  @ApiProperty({
    description: 'the company of the user',
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  company_id: number;
}

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
  })
  password: string;
}


export class JWTPayload {
    sub: number;
    email: string;
    role: string;
    company: string;
}
export class JWTDecoded {
  id: number;
  email: string;
  name: string;
}

export class JWTResponse {
  token: string;
  id: number;
  role: string;
  company: string
}

