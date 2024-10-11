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

import { BudgetGroupService } from './budget-group.service';
import { CreateBudgetGroupDto } from './dto/create-budget-group.dto';
import { SearchBudgetGroupDto } from './dto/search-budget-group.dto';
import { UpdateBudgetGroupDto } from './dto/update-budget-group.dto';
import { BudgetGroup, BudgetGroupDocument } from './entity/budget-group';

@ApiTags('BudgetGroup (User)')
@ApiBearerAuth('user-token')
@UseGuards(UserGuard)
@Controller('/user/budget-group')
export class BudgetGroupController {
  constructor(private readonly budgetGroupService: BudgetGroupService) {}

  @Post('/')
  @ApiModelOkResponse(BudgetGroup)
  async createBudgetGroup(
    @Body() createBudgetGroupDto: CreateBudgetGroupDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<BudgetGroupDocument> {
    createBudgetGroupDto.owner = userId;

    return this.budgetGroupService.create(createBudgetGroupDto);
  }

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(BudgetGroup)
  async getBudgetGroups(
    @Query() query: SearchBudgetGroupDto,
    @Pagination() meta: pagination,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<IFacetResult<BudgetGroupDocument>> {
    query.owner = userId;

    return this.budgetGroupService.find(query, meta);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(BudgetGroup)
  async getBudgetGroupById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<BudgetGroupDocument> {
    return this.budgetGroupService.findOne({ _id: id });
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(BudgetGroup)
  async updateBudgetGroup(
    @Body() updateBudgetGroupDto: UpdateBudgetGroupDto,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<BudgetGroupDocument> {
    return this.budgetGroupService.update({ _id: id }, updateBudgetGroupDto);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(BudgetGroup)
  async deleteBudgetGroupById(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    await this.budgetGroupService.delete({ _id });

    return;
  }
}
