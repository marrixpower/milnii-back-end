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

import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { GroupedBudgetDto } from './dto/grouped-budget.dto';
import { SearchBudgetDto } from './dto/search-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget, BudgetDocument } from './entity/budget';

@ApiTags('Budget (User)')
@ApiBearerAuth('user-token')
@UseGuards(UserGuard)
@Controller('/user/budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('/')
  @PaginationDoc()
  @ApiModelOkResponse(Budget)
  async createBudget(
    @Body() createBudgetDto: CreateBudgetDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<BudgetDocument> {
    createBudgetDto.owner = userId;

    return this.budgetService.create(createBudgetDto);
  }

  @Get('/grouped')
  @ApiModelOkResponse(GroupedBudgetDto, true)
  async getGuestsGrouped(
    @Query() query: SearchBudgetDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<Array<GroupedBudgetDto>> {
    query.owner = userId;

    return this.budgetService.findGrouped(query);
  }

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(Budget)
  async getBudgets(
    @Query() searchBudgetDto: SearchBudgetDto,
    @Pagination() meta: pagination,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<IFacetResult<BudgetDocument>> {
    searchBudgetDto.owner = userId;

    return this.budgetService.find(searchBudgetDto, meta);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(Budget)
  async getBudgetById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<BudgetDocument> {
    return this.budgetService.findOne({ _id: id });
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(Budget)
  async updateBudget(
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<BudgetDocument> {
    return this.budgetService.update({ _id: id }, updateBudgetDto);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(Budget)
  async deleteBudgetById(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    await this.budgetService.delete({ _id });

    return;
  }
}
