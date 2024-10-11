import { Controller, Get, Query } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { FirebaseService } from 'firebasemodule';

import { ApiModelOkResponse } from 'src/common/swagger/ok-response.swagger';
import { DecodedFbToken } from 'src/common/types/decoded-id-token';

import { AdminService } from './admin.service';
import { Admin } from './entity/admin';

@ApiTags('Admin (Admin)')
@Controller('/admin/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get('/seed')
  @ApiExcludeEndpoint()
  @ApiModelOkResponse(Admin)
  async seed(
    @Query() data: { token: string; login: string; password: string },
  ) {
    if (!data.token) return;

    const user: DecodedFbToken = await this.firebaseService
      .auth()
      .verifyIdToken(data.token, true);

    await this.adminService.seed({ ...data, creator: user.uid });
  }
}

