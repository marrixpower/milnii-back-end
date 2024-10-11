import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
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

import { CreateNoteDto } from './dto/create-note.dto';
import { SearchNoteDto } from './dto/search-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note, NoteDocument } from './entity/note';
import { NoteService } from './note.service';

@ApiTags('Note (User)')
@UseGuards(UserGuard)
@ApiBearerAuth('user-token')
@Controller('/user/note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('/')
  @PaginationDoc()
  @ApiModelOkResponse(Note)
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<NoteDocument> {
    createNoteDto.owner = userId;

    return this.noteService.create(createNoteDto);
  }

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(Note)
  async getNotes(
    @Query() searchNoteDto: SearchNoteDto,
    @Pagination() meta: pagination,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<IFacetResult<NoteDocument>> {
    searchNoteDto.owner = userId;

    return this.noteService.find(searchNoteDto, meta);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(Note)
  async getNoteById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<NoteDocument> {
    return this.noteService.findOne({ _id: id });
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(Note)
  async updateNote(
    @Body() updateNoteDto: UpdateNoteDto,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<NoteDocument> {
    return this.noteService.update({ _id: id }, updateNoteDto);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(Note)
  async deleteNoteById(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    await this.noteService.delete({ _id });

    return;
  }
}
