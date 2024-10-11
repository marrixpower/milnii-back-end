import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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

import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entity/task';
import { TaskService } from './task.service';

@ApiTags('Task (User)')
@UseGuards(UserGuard)
@Controller('/user/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/')
  @PaginationDoc()
  @ApiModelOkResponse(Task)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<TaskDocument> {
    createTaskDto.user = userId;

    return this.taskService.create(createTaskDto);
  }

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(Task)
  async getTasks(
    @Query() query: SearchTaskDto,
    @Pagination() meta: pagination,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<IFacetResult<TaskDocument>> {
    query.user = userId;

    return this.taskService.find(query, meta);
  }

  @Patch('/:id')
  @PaginationDoc()
  @ApiModelOkResponse(Task)
  async updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ) {
    return this.taskService.update({ _id }, updateTaskDto);
  }

  @Delete('/:id')
  @ApiBearerAuth('user-token')
  @HttpCode(204)
  @UseGuards(UserGuard)
  async deleteTask(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    await this.taskService.delete({
      _id,
    });

    return;
  }
}
