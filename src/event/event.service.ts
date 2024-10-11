import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { SearchEventDto } from './dto/search-event.dto';
import { Event, EventDocument } from './entity/event';
import { EventTypeEnum } from './enum/event-type.enum';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: Partial<EventDocument>): Promise<EventDocument> {
    const event = await this.eventModel.create(createEventDto);

    return event;
  }

  async find(
    query: SearchEventDto,
    meta: pagination,
  ): Promise<IFacetResult<EventDocument>> {
    const filter: FilterQuery<EventDocument> = {};

    if (query.owner) filter.owner = query.owner;

    return (
      await this.eventModel.aggregate([
        { $match: filter },
        ...facetTotalCount(meta, []),
      ])
    )[0];
  }

  async findOne(query: FilterQuery<EventDocument>): Promise<EventDocument> {
    return (await this.eventModel.aggregate([{ $match: query }]))[0];
  }

  async update(
    filter: FilterQuery<EventDocument>,
    data: UpdateQuery<EventDocument>,
  ) {
    return this.eventModel.findOneAndUpdate(filter, data, { new: true });
  }

  async delete(query: FilterQuery<EventDocument>): Promise<any> {
    return this.eventModel.deleteMany(query);
  }

  async onUserWedding({ weddingDate, user }) {
    [
      'Takha/Rokha (Meeting of the families)',
      'Kurmai (Official Engagement)',
      'Bridal Shower (Bride)',
    ].forEach((e) =>
      this.eventModel.create({
        owner: new Types.ObjectId(user),
        name: e,
        group: EventTypeEnum.PRE_WEDDING,
      }),
    );

    [
      'Maiyan',
      'Mehndi',
      'Jaggo (Evening Maiyan)',
      'Choorah (Bride - Always night before wedding)',
      'Anand Karaj (Wedding Ceremony)',
      'Reception',
    ].forEach((e) =>
      this.eventModel.create({
        owner: new Types.ObjectId(user),
        name: e,
        group: EventTypeEnum.WEDDING,
      }),
    );
  }

  async onUserDeleted(owner: Types.ObjectId) {
    await this.eventModel.deleteMany({ owner });
  }
}
