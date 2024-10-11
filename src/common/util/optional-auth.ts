import { SetMetadata } from '@nestjs/common';

export const AUTH_IS_OPTIONAL = 'auth_is_optional';
export const OptionalAuth = () => SetMetadata(AUTH_IS_OPTIONAL, true);
