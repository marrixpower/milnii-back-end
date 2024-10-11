import { readFileSync } from 'fs';
import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { Types } from 'mongoose';

import { AdminDocument } from 'src/admin/entity/admin';
import { plainify } from 'src/common/util/plainify';

import { RefreshTokenPayloadDto } from './dto/refresh-token-payload.dto';

@Injectable()
export class JwtService {
  private accessSecret: string;
  private refreshSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.accessSecret = readFileSync(
      join(__dirname, '..', '..', 'access.private.key'),
    ).toString();

    this.refreshSecret = readFileSync(
      join(__dirname, '..', '..', 'refresh.private.key'),
    ).toString();
  }

  async verifyRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenPayloadDto> {
    return verify(refreshToken, this.refreshSecret) as RefreshTokenPayloadDto;
  }

  async verifyAccessToken(
    accessToken: string,
  ): Promise<Partial<AdminDocument>> {
    return verify(accessToken, this.accessSecret) as Partial<AdminDocument>;
  }

  async genRefreshToken(_id: Types.ObjectId): Promise<string> {
    return sign({ _id: String(_id) }, this.refreshSecret, {
      algorithm: 'HS256',
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXP'),
    });
  }

  async genAccessToken(admin: AdminDocument): Promise<string> {
    return sign(plainify(admin), this.accessSecret, {
      algorithm: 'HS256',
      expiresIn: this.configService.get('ACCESS_TOKEN_EXP'),
    });
  }
}
