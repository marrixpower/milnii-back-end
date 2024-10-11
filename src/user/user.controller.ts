import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  HttpCode,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FirebaseService } from 'firebasemodule';
import { Types } from 'mongoose';

import { Pagination } from 'src/common/decorator/pagination.decorator';
import { InjectUser } from 'src/common/decorator/user.decorator';
import { UserGuard } from 'src/common/guard/user.guard';
import { ParseObjectIdPipe } from 'src/common/pipe/parse-object-id.pipe';
import { ApiModelOkResponse } from 'src/common/swagger/ok-response.swagger';
import { ApiPaginationResponse } from 'src/common/swagger/pagination-response.swagger';
import { PaginationDoc } from 'src/common/swagger/pagination.swagger';
import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { multerOptions } from 'src/common/util/multer';

import { CheckCredentialsResultDto } from './dto/check-credential-result.dto';
import { CheckCredentialsDto } from './dto/check-credentials.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserSearchDto } from './dto/search.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entity/user';
import { UserService } from './user.service';

@ApiTags('User (User)')
@Controller('/user/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(User)
  async getUsers(
    @Query() query: UserSearchDto,
    @Pagination() meta: pagination,
  ): Promise<IFacetResult<UserDocument>> {
    return this.userService.find(query, meta);
  }

  @Get('/me')
  @ApiModelOkResponse(User)
  @ApiBearerAuth('user-token')
  @UseGuards(UserGuard)
  async getMe(@InjectUser('sub') sub: string): Promise<UserDocument> {
    return this.userService.findOne({
      firebaseId: sub,
    });
  }

  @Patch('/me')
  @ApiBearerAuth('user-token')
  @UseGuards(UserGuard)
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @InjectUser('sub') sub: string,
  ): Promise<UserDocument> {
    return this.userService.update({ firebaseId: sub }, updateUserDto);
  }

  @Patch('/me/photo')
  @ApiModelOkResponse(User)
  @ApiBearerAuth('user-token')
  @UseGuards(UserGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions('user')))
  async updateUserPhoto(
    @UploadedFile()
    file: Express.Multer.File,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<UserDocument> {
    return this.userService.update({ _id: userId }, { image: file.filename });
  }

  @Post('/me')
  @ApiModelOkResponse(User)
  @ApiBearerAuth('user-token')
  @UseGuards(UserGuard)
  async createMe(
    @Body() createUserDto: CreateUserDto,
    @InjectUser('sub') sub: string,
  ): Promise<UserDocument> {
    createUserDto.firebaseId = sub;

    return this.userService.create(createUserDto);
  }

  @Post('/check-credentials')
  @ApiModelOkResponse(CheckCredentialsResultDto)
  async checkCredentials(
    @Body() checkCredentialsDto: CheckCredentialsDto,
  ): Promise<CheckCredentialsResultDto> {
    return this.userService.checkCredentials(checkCredentialsDto);
  }

  @Delete('/me')
  @ApiBearerAuth('user-token')
  @HttpCode(204)
  @UseGuards(UserGuard)
  async deleteMe(@InjectUser('sub') sub: string): Promise<void> {
    await this.userService.delete({
      firebaseId: sub,
    });

    return;
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Post('/confirm-password-reset')
  async confirmNewPassword(
    @Body() confirmPasswordResetDto: ConfirmPasswordResetDto,
  ) {
    return this.userService.confirmPasswordReset(confirmPasswordResetDto);
  }
}
