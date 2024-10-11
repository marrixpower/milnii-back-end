import { readFileSync } from 'fs';
import { join } from 'path';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload, verify } from 'jsonwebtoken';

import { AdminDocument } from 'src/admin/entity/admin';

@Injectable()
export class AdminGuard implements CanActivate {
  private accessPublic: string;

  constructor(private reflector: Reflector) {
    this.accessPublic = readFileSync(join('access.private.key')).toString();
  }

  private extractToken(auth: string) {
    if (!auth) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token: string = auth.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Bearer token must be provided');
    }

    return token;
  }

  private verifyToken(token: string): AdminDocument & JwtPayload {
    try {
      return verify(token, this.accessPublic) as any;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const auth: string = request.headers.authorization;

    const token = this.extractToken(auth);

    request.admin = this.verifyToken(token);

    return true;
  }
}
