import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from 'firebasemodule';

import { DecodedFbToken } from '../types/decoded-id-token';
import { AUTH_IS_OPTIONAL } from '../util/optional-auth';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Asynchronously determines if the user making the request is authorized to access
   * the resource. The function extracts the JWT token from the HTTP request headers,
   * verifies it using Firebase Auth, and returns true if the token is valid.
   *
   * @param {ExecutionContext} context - The execution context object of the current request.
   * @return {Promise<boolean>} - A promise that resolves to a boolean indicating whether the user is authorized.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAuthOptional = this.reflector.get<boolean>(
      AUTH_IS_OPTIONAL,
      context.getHandler(),
    );

    try {
      const auth: string = request.headers.authorization;
      if (!auth) {
        throw new UnauthorizedException('JWT must be provided');
      }

      const token: string = auth.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('JWT must be provided');
      }

      const user: DecodedFbToken = await this.firebaseService
        .auth()
        .verifyIdToken(token, true);

      request.user = user;
    } catch (error) {
      if (isAuthOptional) return true;

      this.logger.log(error.message);

      throw new UnauthorizedException(error.message);
    }

    return true;
  }
}
