import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { RoleService } from "./role.service";
import { Role } from "./entities/role.entity";
import { CreateRoleDto } from "./dto/role.dto";

@ApiTags('roles')
@Controller({path:'roles'})
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class RolesController {
    constructor(
        private readonly rolesService: RoleService
    ){}
    @Get()
    async getAllRoles(): Promise<Role[]> {
        return await this.rolesService.findAll()
    }
    @Post()
    async create(@Body() payload:CreateRoleDto) {
        return await this.rolesService.create(payload)
    }
    @Get('/:roleId')
    @ApiParam({
        name: 'roleId',
        description: 'Role ID',
    })
    async getRoleById(@Param('roleId') roleId: string): Promise<Role> {
        return await this.rolesService.findById(Number(roleId))
    }
}