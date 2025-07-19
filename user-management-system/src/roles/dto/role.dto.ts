import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({
        description: 'Role name',
    })
    name: string

    @ApiProperty({
        description: 'Role code',
    })
    code: string
}