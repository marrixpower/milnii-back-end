import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { Pagination } from 'src/common/decorator/pagination.decorator';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { ParseObjectIdPipe } from 'src/common/pipe/parse-object-id.pipe';
import { ApiModelOkResponse } from 'src/common/swagger/ok-response.swagger';
import { ApiPaginationResponse } from 'src/common/swagger/pagination-response.swagger';
import { PaginationDoc } from 'src/common/swagger/pagination.swagger';
import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { multerOptions } from 'src/common/util/multer';

import { UserSearchDto } from './dto/search.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { UserDocument, User } from './entity/user';
import { UserService } from './user.service';

@ApiTags('User (Admin)')
@UseGuards(AdminGuard)
@Controller('/admin/user')
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiBearerAuth('admin-token')
  @PaginationDoc()
  @ApiPaginationResponse(User)
  async getUsers(
    @Query() searchUserDto: UserSearchDto,
    @Pagination() meta: pagination,
  ): Promise<IFacetResult<UserDocument>> {
    return this.userService.find(searchUserDto, meta);
  }

  @Get('/:id')
  @ApiBearerAuth('admin-token')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(User)
  async getUserById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<UserDocument> {
    return this.userService.findOne({ _id: id });
  }

  @Patch('/:id')
  @ApiBearerAuth('admin-token')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(User)
  async updateUser(
    @Body() updateUserDto: UpdateUserByAdminDto,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<UserDocument> {
    return this.userService.update({ _id: id }, updateUserDto);
  }

  @Patch('/:id/photo')
  @ApiModelOkResponse(User)
  @ApiBearerAuth('admin-token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions('user')))
  async updateUserPhoto(
    @UploadedFile()
    file: Express.Multer.File,
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<UserDocument> {
    return this.userService.update({ _id }, { image: file.filename });
  }

  @Delete('/:id')
  @ApiBearerAuth('admin-token')
  @HttpCode(204)
  async deleteMe(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    await this.userService.delete({
      _id,
    });

    return;
  }
}

