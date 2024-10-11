import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

import { CreateGuestGroupDto } from './dto/create-guest-group.dto';
import { SearchGuestGroupDto } from './dto/search-guest-group.dto';
import { UpdateGuestGroupDto } from './dto/update-guest-group.dto';
import { GuestGroup, GuestGroupDocument } from './entity/guest-group';
import { GuestGroupService } from './guest-group.service';

@ApiTags('GuestGroup (User)')
@ApiBearerAuth('user-token')
@UseGuards(UserGuard)
@Controller('/user/guest-group')
export class GuestGroupController {
  constructor(private readonly guestGroupService: GuestGroupService) {}

  @Post('/')
  @ApiModelOkResponse(GuestGroup)
  async createGuestGroup(
    @Body() createGuestGroupDto: CreateGuestGroupDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<GuestGroupDocument> {
    createGuestGroupDto.owner = userId;

    return this.guestGroupService.create(createGuestGroupDto);
  }

  @Get('/:id')
  @ApiModelOkResponse(GuestGroup)
  async getGuestGroup(
    @Body() updateGuestGroupDto: UpdateGuestGroupDto,
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ) {
    return this.guestGroupService.update({ _id }, updateGuestGroupDto);
  }

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(GuestGroup)
  async getGuestGroups(
    @Query() query: SearchGuestGroupDto,
    @Pagination() meta: pagination,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<IFacetResult<GuestGroupDocument>> {
    query.owner = userId;

    return this.guestGroupService.find(query, meta);
  }

  @Patch('/:id')
  @ApiModelOkResponse(GuestGroup)
  async updateGuestGroup(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
    @Body() updateGuestGroupDto: UpdateGuestGroupDto,
  ) {
    return this.guestGroupService.update({ _id }, updateGuestGroupDto);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteGuestGroup(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    await this.guestGroupService.delete({
      _id,
    });

    return;
  }
}
