import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { escapeRegexpString } from 'src/common/util/escape-regexp-string';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteCategoryDto } from './dto/favorite-category.dto';
import { FavoriteSearchDto } from './dto/favorite-search.dto';
import { PopulatedFavoriteDto } from './dto/populated-favorite.dto';
import { Favorite, FavoriteDocument } from './entity/favorite';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<FavoriteDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Creates a new favorite using the provided data.
   *
   * @param {CreateFavoriteDto} data - The data favorite to create the favorite.
   * @return {Promise<FavoriteDocument>} Returns a promise that resolves to the newly created favorite.
   */
  async create(data: CreateFavoriteDto): Promise<FavoriteDocument> {
    const favorite = await this.favoriteModel.create(data);

    return favorite;
  }

  async findCategories(
    query: FavoriteSearchDto,
    meta: pagination,
  ): Promise<IFacetResult<FavoriteCategoryDto>> {
    const filter: FilterQuery<FavoriteDocument> = {};

    if (query.owner) filter.owner = query.owner;

    if (query.type) filter.type = query.type;

    return (
      await this.favoriteModel.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'Business',
            localField: 'favorite',
            foreignField: '_id',
            as: 'favorite',
          },
        },
        {
          $addFields: {
            favorite: {
              $arrayElemAt: ['$favorite', 0],
            },
          },
        },
        {
          $group: {
            _id: '$favorite.category',
            count: {
              $sum: 1,
            },
            favorite: {
              $first: '$favorite',
            },
          },
        },
        ...facetTotalCount(meta, [
          {
            $lookup: {
              from: 'Category',
              localField: '_id',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $addFields: {
              category: {
                $arrayElemAt: ['$category', 0],
              },
            },
          },
        ]),
      ])
    )[0];
  }

  /**
   * Asynchronously finds a favorite based on the given filter query and pagination metadata.
   *
   * @param {FilterQuery<FavoriteDocument>} query - The filter query favorite to search for the favorite.
   * @param {pagination} meta - The pagination metadata favorite to limit the search results.
   * @return {Promise<IFacetResult<PopulatedFavoriteDto>>} A promise that resolves to the found favorite document.
   */
  async find(
    query: FavoriteSearchDto,
    meta: pagination,
  ): Promise<IFacetResult<PopulatedFavoriteDto>> {
    const filter: FilterQuery<FavoriteDocument> = {};

    query.owner && (filter.owner = query.owner);

    query.type && (filter.type = query.type);

    query.category && (filter['favorite.category'] = query.category);

    query.name &&
      (filter['favorite.name'] = {
        $regex: escapeRegexpString(query.name),
        $options: 'i',
      });

    return (
      await this.favoriteModel.aggregate([
        ...this.lookupFavorite(),
        { $match: filter },
        ...facetTotalCount(meta, this.lookupFavoriteCategory()),
      ])
    )[0];
  }

  /**
   * Asynchronously finds a single document that matches the given query
   * in the Favorite collection.
   *
   * @param {FilterQuery<FavoriteDocument>} query - The query favorite to find the Favorite.
   * @return {Promise<FavoriteDocument>} - A promise that resolves to the found Favorite,
   * or null if no interest was found.
   */
  async findOne(
    query: FilterQuery<FavoriteDocument>,
  ): Promise<PopulatedFavoriteDto> {
    return (
      await this.favoriteModel.aggregate([
        { $match: query },
        ...this.lookupFavorite(),
        ...this.lookupFavoriteCategory(),
      ])
    )[0];
  }

  /**
   * Asynchronously deletes a user document that matches the given query.
   *
   * @param {FilterQuery<FavoriteDocument>} query - The query favorite to filter the user documents to delete.
   * @return {Promise<any>} A promise that resolves to the result of the delete operation.
   */
  async delete(query: FilterQuery<FavoriteDocument>): Promise<any> {
    return this.favoriteModel.deleteOne(query);
  }

  private lookupFavorite(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: 'Business',
          localField: 'favorite',
          foreignField: '_id',
          as: 'favorite',
        },
      },
      {
        $addFields: {
          favorite: {
            $arrayElemAt: ['$favorite', 0],
          },
        },
      },
    ];
  }

  private lookupFavoriteCategory(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: 'Category',
          localField: 'favorite.category',
          foreignField: '_id',
          as: 'favorite.category',
        },
      },
      {
        $addFields: {
          'favorite.category': {
            $arrayElemAt: ['$favorite.category', 0],
          },
        },
      },
    ];
  }

  async onUserDeleted(owner: Types.ObjectId) {
    await this.favoriteModel.deleteMany({ owner });
  }
}
