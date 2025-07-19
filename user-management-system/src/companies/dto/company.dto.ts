import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createCompanyDto {
  @ApiProperty({
    description: 'company name',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'company description',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  description: string;

  @ApiProperty({
    description: 'company address',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({
    description: 'email address',
  })
  email: string;

  @ApiProperty({
    description: 'company contact_no',
  })
  contact_no: string;
}
