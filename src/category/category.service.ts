import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { escapeRegexpString } from 'src/common/util/escape-regexp-string';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { SearchCategoryDto } from './dto/search-category.dto';
import { Category, CategoryDocument } from './entity/category';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * Asynchronously finds a single document that matches the given query
   * in the Category collection.
   *
   * @param {FilterQuery<CategoryDocument>} query - The query used to find the category.
   * @return {Promise<CategoryDocument>} - A promise that resolves to the found category,
   * or null if no category was found.
   */
  async findOne(
    query: FilterQuery<CategoryDocument>,
  ): Promise<CategoryDocument> {
    return (await this.categoryModel.aggregate([{ $match: query }]))[0];
  }

  /**
   * Asynchronously finds a category based on the given filter query and pagination metadata.
   *
   * @param {FilterQuery<SearchCategoryDto>} query - The filter query used to search for the category.
   * @param {pagination} meta - The pagination metadata used to limit the search results.
   * @return {Promise<IFacetResult<CategoryDocument>>} A promise that resolves to the found category document.
   */
  async find(
    query: SearchCategoryDto,
    meta: pagination,
  ): Promise<IFacetResult<CategoryDocument>> {
    const pipeline: PipelineStage[] = [];

    const filter: FilterQuery<CategoryDocument> = {};

    if (query.name)
      filter['name.value'] = {
        $regex: escapeRegexpString(query.name),
        $options: 'i',
      };

    pipeline.push({ $match: filter });

    pipeline.push(...facetTotalCount(meta));

    return (await this.categoryModel.aggregate(pipeline))[0];
  }

  async create(data: Partial<CategoryDocument>): Promise<CategoryDocument> {
    return this.categoryModel.create(data);
  }

  async update(
    query: FilterQuery<CategoryDocument>,
    data: Partial<CategoryDocument>,
  ): Promise<CategoryDocument> {
    return this.categoryModel.findOneAndUpdate(query, data, { new: true });
  }

  async delete(query: FilterQuery<CategoryDocument>): Promise<any> {
    return this.categoryModel.deleteMany(query);
  }
}

