import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { createUserDto, GetUsersDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@ApiTags('user')
@Controller({ path: 'user' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() payload: createUserDto, @Req() req) {
    return await this.userService.createUser(payload, req.user);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query() payload: GetUsersDto,
    @Req() req,
  ): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    return this.userService.findAll(payload, req.user);
  }

  @Get('/:userId')
  @ApiParam({
    name: 'userId',
    description: 'User Id',
  })
  async findById(@Param('userId') userId: string): Promise<User> {
    return await this.userService.findById(Number(userId));
  }

  @Post('/:userId')
  @ApiParam({
    name: 'userId',
    description: 'User Id',
  })
  async removeUser(@Param('userId') userId: string, @Req() req) {
    return await this.userService.softDelete(Number(userId), req.user);
  }
}
