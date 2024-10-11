import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  PipelineStage,
  Types,
  UpdateQuery,
} from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { escapeRegexpString } from 'src/common/util/escape-regexp-string';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { PopulatedBusinessDto } from './dto/populated-business.dto';
import { BusinessSearchDto } from './dto/search.dto';
import { Business, BusinessDocument } from './entity/business';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
  ) {}

  /**
   *
   * @param {Partial<BusinessDocument>} data - The data for the business document to create.
   * @return {Promise<BusinessDocument>} The newly created business document.
   */
  async create(data: Partial<BusinessDocument>): Promise<BusinessDocument> {
    const business = await this.businessModel.create(data);

    return business;
  }

  /**
   * Asynchronously updates a business document in the database that matches the provided query with the provided data.
   *
   * @param {FilterQuery<BusinessDocument>} query - The query to match documents to update.
   * @param {Partial<BusinessDocument>} data - The data to update the matched documents with.
   * @return {Promise<BusinessDocument>} The updated business document or throws a ForbiddenException if no document was found matching the query.
   */
  async update(
    query: FilterQuery<BusinessDocument>,
    data: UpdateQuery<BusinessDocument>,
  ): Promise<BusinessDocument> {
    return this.businessModel
      .findOneAndUpdate(query, data, { new: true })
      .orFail(new ForbiddenException('Business not exists'));
  }

  /**
   * Asynchronously finds a single document that matches the given query
   * in the Business collection.
   *
   * @param {FilterQuery<BusinessDocument>} query - The query used to find the business.
   * @return {Promise<PopulatedBusinessDto>} - A promise that resolves to the found business,
   * or null if no business was found.
   */
  async findOne(
    query: FilterQuery<BusinessDocument>,
    userId?: Types.ObjectId,
  ): Promise<PopulatedBusinessDto> {
    return (
      await this.businessModel.aggregate([
        { $match: query },
        ...this.lookupFavorite(userId),
        ...this.lookupCategory(),
        ...this.lookupOwner(),
      ])
    )[0];
  }

  /**
   * Asynchronously finds a business based on the given filter query and pagination metadata.
   *
   * @param {FilterQuery<BusinessSearchDto>} query - The filter query used to search for the business.
   * @param {pagination} meta - The pagination metadata used to limit the search results.
   * @return {Promise<IFacetResult<PopulatedBusinessDto>>} A promise that resolves to the found business document.
   */
  async find(
    query: BusinessSearchDto,
    meta: pagination,
    userId?: Types.ObjectId,
  ): Promise<IFacetResult<PopulatedBusinessDto>> {
    const pipeline: PipelineStage[] = [];

    const filter: FilterQuery<BusinessDocument> = {};

    if (query.owner) filter.owner = query.owner;

    if (query.category) filter.category = query.category;

    if (query.name)
      filter.name = { $regex: escapeRegexpString(query.name), $options: 'i' };

    pipeline.push({ $match: filter });

    pipeline.push(
      ...facetTotalCount(
        meta,
        this.lookupFavorite(userId)
          .concat(this.lookupCategory())
          .concat(this.lookupOwner()),
      ),
    );

    return (await this.businessModel.aggregate(pipeline))[0];
  }

  /**
   * Asynchronously deletes a business document that matches the given query.
   *
   * @param {FilterQuery<BusinessDocument>} query - The query used to filter the business documents to delete.
   * @return {Promise<any>} A promise that resolves to the result of the delete operation.
   */
  async delete(query: FilterQuery<BusinessDocument>): Promise<any> {
    return this.businessModel.deleteOne(query);
  }

  private lookupFavorite(userId?: Types.ObjectId): PipelineStage[] {
    if (!userId) return [];

    return [
      {
        $lookup: {
          from: 'Favorite',
          let: {
            favorite: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$$favorite', '$favorite'],
                    },
                    {
                      $eq: [userId, '$owner'],
                    },
                  ],
                },
              },
            },
          ],
          as: 'favorite',
        },
      },
    ];
  }

  private lookupCategory(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: 'Category',
          localField: 'category',
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
    ];
  }

  private lookupOwner(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: 'User',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $addFields: {
          owner: {
            $arrayElemAt: ['$owner', 0],
          },
        },
      },
    ];
  }
}

