import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiModelOkResponse } from 'src/common/swagger/ok-response.swagger';

import { AdminAuthService } from './auth.service';
import { AccessTokenResponseDto } from './dto/access-token-response.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth (Admin)')
@Controller('/admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiModelOkResponse(AccessTokenResponseDto)
  @ApiOperation({
    description: `Perform login using login & password. \n
      Use access token for authorization required operations, \n
      access token is short living (15m) and no need to request it before every request.
      Refresh token needed for generating new access/refresh tokens pair after expiration of access token. \n
      Refresh token is one-time and set to cookies.`,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res,
  ): Promise<AccessTokenResponseDto> {
    const { accessToken, refreshToken } = await this.authService.login(
      loginDto,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { accessToken };
  }

  @Post('/refresh')
  @ApiOperation({
    description:
      'Refresh access/refresh tokens pair after expiration of access token.',
  })
  @HttpCode(200)
  @ApiModelOkResponse(AccessTokenResponseDto)
  async refresh(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<AccessTokenResponseDto> {
    const oldRefreshToken = req.cookies?.['refreshToken'];

    if (!oldRefreshToken) throw new ForbiddenException('RefreshToken missing');

    const { accessToken, refreshToken } = await this.authService.refresh(
      oldRefreshToken,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { accessToken };
  }

  @Post('/logout')
  @ApiOperation({
    description: 'Invalidate refresh token.',
  })
  @HttpCode(200)
  async logout(@Req() req, @Res({ passthrough: true }) res): Promise<void> {
    const oldRefreshToken = req?.cookies?.['refreshToken'];

    if (!oldRefreshToken) throw new ForbiddenException('RefreshToken missing');

    res.clearCookie('refreshToken');

    await this.authService.logout(oldRefreshToken);
  }
}
