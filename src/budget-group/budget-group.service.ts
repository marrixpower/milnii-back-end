import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { SearchBudgetGroupDto } from './dto/search-budget-group.dto';
import { BudgetGroup, BudgetGroupDocument } from './entity/budget-group';

@Injectable()
export class BudgetGroupService {
  constructor(
    @InjectModel(BudgetGroup.name)
    private readonly budgetGroupModel: Model<BudgetGroupDocument>,
  ) {}

  async create(
    createBudgetGroupDto: Partial<BudgetGroupDocument>,
  ): Promise<BudgetGroupDocument> {
    const budgetGroup = await this.budgetGroupModel.create(
      createBudgetGroupDto,
    );

    return budgetGroup;
  }

  async find(
    query: SearchBudgetGroupDto,
    meta: pagination,
  ): Promise<IFacetResult<BudgetGroupDocument>> {
    const filter: FilterQuery<BudgetGroupDocument> = {};

    if (query.owner) filter.owner = query.owner;

    return (
      await this.budgetGroupModel.aggregate([
        { $match: filter },
        ...facetTotalCount(meta, []),
      ])
    )[0];
  }

  async findOne(
    query: FilterQuery<BudgetGroupDocument>,
  ): Promise<BudgetGroupDocument> {
    return (await this.budgetGroupModel.aggregate([{ $match: query }]))[0];
  }

  async update(
    filter: FilterQuery<BudgetGroupDocument>,
    data: UpdateQuery<BudgetGroupDocument>,
  ) {
    return this.budgetGroupModel.findOneAndUpdate(filter, data, { new: true });
  }

  async delete(filter: FilterQuery<BudgetGroupDocument>) {
    return this.budgetGroupModel.deleteMany(filter);
  }

  async onUserWedding({ weddingDate, user }) {
    [
      'Ceremony',
      'Reception',
      'Music',
      'Invitations',
      'Transport',
      'Jewellery',
      'Health & Beauty',
      'Honeymoon',
      'Venues',
      'Catering',
      'Decor',
      'Outfits',
      'DJ',
      'Alcohol',
      'Bartending',
      'Tents',
      'Car Rentals',
      'Flowers',
      'Wedding Cake',
    ].forEach((e) =>
      this.budgetGroupModel.create({
        owner: new Types.ObjectId(user),
        name: e,
      }),
    );
  }

  async onUserDeleted(owner: Types.ObjectId) {
    await this.budgetGroupModel.deleteMany({ owner });
  }
}
