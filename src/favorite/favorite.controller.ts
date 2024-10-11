import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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

import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteCategoryDto } from './dto/favorite-category.dto';
import { FavoriteSearchDto } from './dto/favorite-search.dto';
import { PopulatedFavoriteDto } from './dto/populated-favorite.dto';
import { Favorite, FavoriteDocument } from './entity/favorite';
import { FavoriteTypeEnum } from './enum/favorite-type.enum';
import { FavoriteService } from './favorite.service';

@ApiTags('Favorite (User)')
@Controller('/user/favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get('/')
  @PaginationDoc()
  @ApiBearerAuth('user-token')
  @UseGuards(UserGuard)
  @ApiPaginationResponse(PopulatedFavoriteDto)
  async getFavorites(
    @Query() query: FavoriteSearchDto,
    @Pagination() meta: pagination,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<IFacetResult<PopulatedFavoriteDto>> {
    query.owner = userId;

    return this.favoriteService.find(query, meta);
  }

  @Get('/category')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(FavoriteCategoryDto)
  @PaginationDoc()
  @ApiBearerAuth('user-token')
  @UseGuards(UserGuard)
  async getFavoriteCategories(
    @Query() query: FavoriteSearchDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Pagination() meta: pagination,
  ): Promise<IFacetResult<FavoriteCategoryDto>> {
    query.owner = userId;

    return this.favoriteService.findCategories(query, meta);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(PopulatedFavoriteDto)
  async getFavoriteById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<PopulatedFavoriteDto> {
    return this.favoriteService.findOne({ _id: id });
  }

  @Get('/:id/by-favorite')
  @ApiParam({ name: 'id', type: String })
  @ApiModelOkResponse(PopulatedFavoriteDto)
  @ApiBearerAuth('user-token')
  @UseGuards(UserGuard)
  async getFavorite(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @InjectUser('sub') sub: string,
  ): Promise<PopulatedFavoriteDto> {
    return this.favoriteService.findOne({ favorite: id, owner: sub });
  }

  @Post('/')
  @ApiModelOkResponse(Favorite)
  @ApiBearerAuth('user-token')
  @UseGuards(UserGuard)
  async createFavorite(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<FavoriteDocument> {
    createFavoriteDto.owner = userId;

    return this.favoriteService.create(createFavoriteDto);
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiBearerAuth('user-token')
  @UseGuards(UserGuard)
  @ApiParam({ name: 'id', type: String, description: 'favorite._id' })
  @ApiQuery({ name: 'type', type: String, enum: FavoriteTypeEnum })
  async deleteFavoriteById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Query('type') type: FavoriteTypeEnum,
    @InjectUser('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<FavoriteDocument> {
    await this.favoriteService.delete({ owner: userId, favorite: id, type });

    return;
  }
}
