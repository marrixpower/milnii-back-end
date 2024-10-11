import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  HttpCode,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
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

import { BusinessService } from './business.service';
import { PopulatedBusinessDto } from './dto/populated-business.dto';
import { BusinessSearchDto } from './dto/search.dto';
import { UpdateBusinessByAdminDto } from './dto/update-business-by-admin.dto';
import { UpdateImagesDto } from './dto/update-images.dto';
import { Business, BusinessDocument } from './entity/business';

@ApiTags('Business (Admin)')
@ApiBearerAuth('admin-token')
@UseGuards(AdminGuard)
@Controller('/admin/business')
export class BusinessAdminController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('/')
  @PaginationDoc()
  @ApiPaginationResponse(PopulatedBusinessDto)
  async getBusinesses(
    @Query() query: BusinessSearchDto,
    @Pagination() meta: pagination,
  ): Promise<IFacetResult<PopulatedBusinessDto>> {
    return this.businessService.find(query, meta);
  }

  @Get('/:id')
  @ApiModelOkResponse(PopulatedBusinessDto)
  async getMe(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<PopulatedBusinessDto> {
    return this.businessService.findOne({
      _id: id,
    });
  }

  @Patch('/:id')
  async updateMe(
    @Body() updateBusinessDto: UpdateBusinessByAdminDto,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<BusinessDocument> {
    return this.businessService.update({ _id: id }, updateBusinessDto);
  }

  @Patch('/:id/photo')
  @ApiModelOkResponse(Business)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions('business')))
  async updatePublicationPhoto(
    @UploadedFiles()
    files: Express.Multer.File[],
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateImagesDto: UpdateImagesDto,
  ): Promise<BusinessDocument> {
    updateImagesDto.images = [];

    if (files?.length) {
      updateImagesDto.images = files.map((file) => file.filename);
    }
    if (updateImagesDto?.oldImages?.length) {
      updateImagesDto.images.push(...updateImagesDto.oldImages);
    }

    return this.businessService.update(
      { _id: id },
      { images: updateImagesDto.images },
    );
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteMe(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<void> {
    await this.businessService.delete({
      _id: id,
    });

    return;
  }
}

