import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDocument, Category } from './entity/category';

@ApiTags('Category (Admin)')
@UseGuards(AdminGuard)
@ApiBearerAuth('admin-token')
@Controller('/admin/category')
export class CategoryAdminController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
  @ApiModelOkResponse(Category)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(Category)
  async getCategories(
    @Query() searchCategoryDto: SearchCategoryDto,
    @Pagination() meta: pagination,
  ): Promise<IFacetResult<CategoryDocument>> {
    return this.categoryService.find(searchCategoryDto, meta);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(Category)
  async getCategoryById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<CategoryDocument> {
    return this.categoryService.findOne({ _id: id });
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(Category)
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<CategoryDocument> {
    return this.categoryService.update({ _id: id }, updateCategoryDto);
  }

  @Patch('/:id/photo')
  @ApiModelOkResponse(Category)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions('category')))
  async updateCategoryPhoto(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<CategoryDocument> {
    return this.categoryService.update({ _id }, { image: file.filename });
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(Category)
  async deleteCategoryById(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<void> {
    await this.categoryService.delete({ _id });

    return;
  }
}

