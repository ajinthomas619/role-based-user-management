import { ApiProperty } from '@nestjs/swagger';

export class createCompanyDto {
  @ApiProperty({
    description: 'company name',
  })
  name: string;

  @ApiProperty({
    description: 'company description',
  })
  description: string;

  @ApiProperty({
    description: 'company address',
  })
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
