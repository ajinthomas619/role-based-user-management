import { Type } from '@nestjs/class-transformer';
import { IsNumber, IsOptional, IsString, Min } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty({
    description: 'First Name',
  })
  first_name: string;

  @ApiProperty({
    description: 'Last Name',
  })
  last_name: string;

  @ApiProperty({
    description: 'Email',
  })
  email: string;

  @ApiProperty({
    description: 'Password',
  })
  password: string;

  @ApiProperty({
    description: 'Phone Number',
    required: false,
  })
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: 'User Role',
  })
  role_id: number;
}

export class GetUsersDto {
  @ApiProperty({ required: false, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
