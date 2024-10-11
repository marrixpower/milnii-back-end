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

import { CreateGuestDto } from './dto/create-guest.dto';
import { GroupedGuestsDto } from './dto/grouped-guests.dto';
import { SearchGuestDto } from './dto/search-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest, GuestDocument } from './entity/guest';
import { GuestService } from './guest.service';

@ApiTags('Guest (User)')
@ApiBearerAuth('user-token')
@UseGuards(UserGuard)
@Controller('/user/guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post('/')
  @PaginationDoc()
  @ApiModelOkResponse(Guest)
  async createGuest(
    @Body() createGuestDto: CreateGuestDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<GuestDocument> {
    createGuestDto.owner = userId;

    return this.guestService.create(createGuestDto);
  }

  @Get('/grouped')
  @ApiModelOkResponse(GroupedGuestsDto, true)
  async getGuestsGrouped(
    @Query() query: SearchGuestDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<Array<GroupedGuestsDto>> {
    query.owner = userId;

    return this.guestService.findGrouped(query);
  }

  @Get('/:id')
  @PaginationDoc()
  @ApiModelOkResponse(Guest)
  async getGuest(
    @Body() updateGuestDto: UpdateGuestDto,
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ) {
    return this.guestService.update({ _id }, updateGuestDto);
  }

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(Guest)
  async getGuests(
    @Query() query: SearchGuestDto,
    @Pagination() meta: pagination,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<IFacetResult<GuestDocument>> {
    query.owner = userId;

    return this.guestService.find(query, meta);
  }

  @Patch('/:id')
  @PaginationDoc()
  @ApiModelOkResponse(Guest)
  async updateGuest(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
    @Body() updateGuestDto: UpdateGuestDto,
  ) {
    return this.guestService.update({ _id }, updateGuestDto);
  }

  @Delete('/:id')
  @ApiBearerAuth('user-token')
  @HttpCode(204)
  @UseGuards(UserGuard)
  async deleteGuest(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    await this.guestService.delete({
      _id,
    });

    return;
  }
}
