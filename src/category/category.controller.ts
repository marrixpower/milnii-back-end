import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { Pagination } from 'src/common/decorator/pagination.decorator';
import { ParseObjectIdPipe } from 'src/common/pipe/parse-object-id.pipe';
import { ApiModelOkResponse } from 'src/common/swagger/ok-response.swagger';
import { ApiPaginationResponse } from 'src/common/swagger/pagination-response.swagger';
import { PaginationDoc } from 'src/common/swagger/pagination.swagger';
import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';

import { CategoryService } from './category.service';
import { SearchCategoryDto } from './dto/search-category.dto';
import { Category, CategoryDocument } from './entity/category';

@ApiTags('Category (Category)')
@Controller('/user/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(Category)
  async getCategories(
    @Query() query: SearchCategoryDto,
    @Pagination() meta: pagination,
  ): Promise<IFacetResult<CategoryDocument>> {
    return this.categoryService.find(query, meta);
  }

  @Get('/:id')
  @ApiModelOkResponse(Category)
  async getMe(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<CategoryDocument> {
    return this.categoryService.findOne({
      _id: id,
    });
  }
}

