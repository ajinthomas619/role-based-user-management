import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiTags('Auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private extractToke(req: Request): string {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or malformed authorization header',
      );
    }
    return authHeader.split(' ')[1];
  }

  @Post('signup')
  async signup(@Body() user: SignUpDto): Promise<any> {
    return await this.authService.signUp(user);
  }

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return await this.authService.login(payload);
  }

  @Get('user-details')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  async getUserDetails(@Req() req: Request) {
    const accessToken = this.extractToke(req);
    return this.authService.getUserDetailsFromToken(accessToken);
  }
}
