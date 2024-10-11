import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { escapeRegexpString } from 'src/common/util/escape-regexp-string';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { GroupedBudgetDto } from './dto/grouped-budget.dto';
import { SearchBudgetDto } from './dto/search-budget.dto';
import { Budget, BudgetDocument } from './entity/budget';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budget.name)
    private readonly budgetModel: Model<BudgetDocument>,
  ) {}

  async create(
    createBudgetDto: Partial<BudgetDocument>,
  ): Promise<BudgetDocument> {
    const budget = await this.budgetModel.create(createBudgetDto);

    return budget;
  }

  async findGrouped(query: SearchBudgetDto): Promise<GroupedBudgetDto[]> {
    const filter: FilterQuery<BudgetDocument> = {};

    if (query.owner) filter.owner = query.owner;

    if (query.name)
      filter.name = {
        $regex: escapeRegexpString(query.name),
        $options: 'i',
      };

    if (query.status) filter.status = query.status;

    return this.budgetModel.aggregate([
      { $match: filter },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $group: {
          _id: '$group',
          budget: {
            $push: '$$ROOT',
          },
          estimatedCost: {
            $sum: { $ifNull: ['$estimatedCost', 0] },
          },
          finalCost: {
            $sum: { $ifNull: ['$finalCost', 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'BudgetGroup',
          localField: '_id',
          foreignField: '_id',
          as: 'group',
        },
      },
      {
        $addFields: {
          group: { $arrayElemAt: ['$group', 0] },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  }

  async find(
    query: SearchBudgetDto,
    meta: pagination,
  ): Promise<IFacetResult<BudgetDocument>> {
    const filter: FilterQuery<BudgetDocument> = {};

    if (query.owner) filter.owner = query.owner;

    if (query.name)
      filter.name = {
        $regex: escapeRegexpString(query.name),
        $options: 'i',
      };

    if (query.status) filter.status = query.status;

    return (
      await this.budgetModel.aggregate([
        { $match: filter },
        ...facetTotalCount(meta, []),
      ])
    )[0];
  }

  async findOne(query: FilterQuery<BudgetDocument>): Promise<BudgetDocument> {
    return (await this.budgetModel.aggregate([{ $match: query }]))[0];
  }

  async update(
    filter: FilterQuery<BudgetDocument>,
    data: UpdateQuery<BudgetDocument>,
  ) {
    return this.budgetModel.findOneAndUpdate(filter, data, { new: true });
  }

  async delete(filter: FilterQuery<BudgetDocument>) {
    return this.budgetModel.deleteMany(filter);
  }
}
