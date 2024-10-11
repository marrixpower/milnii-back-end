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

import { CreateEventDto } from './dto/create-event.dto';
import { SearchEventDto } from './dto/search-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventDocument } from './entity/event';
import { EventService } from './event.service';

@ApiTags('Event (User)')
@ApiBearerAuth('user-token')
@UseGuards(UserGuard)
@Controller('/user/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/')
  @PaginationDoc()
  @ApiModelOkResponse(Event)
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<EventDocument> {
    createEventDto.owner = userId;

    return this.eventService.create(createEventDto);
  }

  @Get('/:id')
  @PaginationDoc()
  @ApiModelOkResponse(Event)
  async getEvent(
    @Body() updateEventDto: UpdateEventDto,
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ) {
    return this.eventService.update({ _id }, updateEventDto);
  }

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(Event)
  async getEvents(
    @Query() query: SearchEventDto,
    @Pagination() meta: pagination,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<IFacetResult<EventDocument>> {
    query.owner = userId;

    return this.eventService.find(query, meta);
  }

  @Patch('/:id')
  @PaginationDoc()
  @ApiModelOkResponse(Event)
  async updateEvent(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update({ _id }, updateEventDto);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteEvent(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    await this.eventService.delete({
      _id,
    });

    return;
  }
}
