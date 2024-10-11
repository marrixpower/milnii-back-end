import { Injectable } from '@nestjs/common';

import { UserService } from './user.service';

@Injectable()
export class UserEventHandler {
  constructor(private readonly userService: UserService) {}
}
