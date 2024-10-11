import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sub } from 'date-fns';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

import { IFacetResult } from 'src/common/types/IFacetResult';
import { pagination } from 'src/common/types/pagination';
import { escapeRegexpString } from 'src/common/util/escape-regexp-string';
import { facetTotalCount } from 'src/common/util/facet-total-count';

import { SearchTaskDto } from './dto/search-task.dto';
import { Task, TaskDocument } from './entity/task';
import { TaskDateEnum } from './enum/task-date.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async onUserWedding({ weddingDate, user }) {
    const rawTasks = [
      {
        date: sub(weddingDate, { months: 18 }),
        dateType: TaskDateEnum.MONTHS_18_12,
        tasks: [
          'Pick Your Wedding Date',
          'Determine Budget',
          'Check Availability and Book:',
          'Gurdwara(Temple)',
          'Reception Venue',
          'Mehndi Artist (Bride)',
          'Pagh Tier (Groom Turban Tier)',
          'DJ',
          'Videographer & Photographer',
          'Decor & Florist',
          'Tents',
          'Limo and Party Busses',
          'Visit Venues',
          'Start forming a guestlist',
          'Start Pinterest Board',
          'Pick Themes for events.',
          'Discuss: Bachelorette and Stagette party, and honeymoon',
        ],
      },
      {
        date: sub(weddingDate, { months: 8 }),
        dateType: TaskDateEnum.MONTHS_8_6,
        tasks: [
          'Order Outfits for Bride and Groom',
          'Order Pagh(Turban) and Ramals',
          'Order Bridesmaids and groomsmen outfits',
          'Order Outfits for brides brothers',
          'Think about party favors',
          'Start Planning outfits for different events',
          'Order Wedding Invitations and Ladoo Boxes',
          'Make a wedding website',
          'Book hotel for guests and yourself',
          'Register for gifts',
          'Meet your florist',
          'Send out bridesmaid/groomsmen proposals',
          'Place order for the sweets',
          'Meet with the caterers',
          'Order Wedding Cake',
        ],
      },
      {
        date: sub(weddingDate, { months: 6 }),
        dateType: TaskDateEnum.MONTHS_8_6,
        tasks: [
          'Book your wedding day car',
          'Check if guests need transportation',
          'Pick out wedding bands',
          'Book honeymoon',
          'Capture your pre-wedding pictures',
          'Plan out Dance Performances',
          'Pick locations for photo sessions for post wedding day, and pre reception',
          'Some require reservations',
          'Decide on Hair and Makeup Styles',
        ],
      },
      {
        date: sub(weddingDate, { months: 4 }),
        dateType: TaskDateEnum.MONTHS_4_2,
        tasks: [
          'Book',
          'Haircuts',
          'Manicure and pedicure',
          'Practice dance performances',
          'Order reception sign-in book',
        ],
      },
      {
        date: sub(weddingDate, { months: 2 }),
        dateType: TaskDateEnum.MONTHS_2,
        tasks: [
          'Look into a skincare routine',
          'Look into a teeth whitening plan',
          'Go for your outfit fitting',
          'Make seating arrangements for main events',
          'Start working on speeches and assign MC',
          'Place order for all signage',
          'Order pre-shoot canvas',
          'Get a liquor license and complete course',
          'Get marriage certificate',
        ],
      },
      {
        date: sub(weddingDate, { weeks: 4 }),
        dateType: TaskDateEnum.MONTH_1,
        tasks: [
          'Update your registry',
          'Practice your first dance',
          'Confirm all airport arrivals',
          'Confirm all guest stays',
          'Pick up liquor',
          'Put together baby pictures',
          'Write all thank you cards',
          'Steam all wedding outfits',
          'Attach accessories to outfits',
          'Print your liquor license',
        ],
      },
      {
        date: sub(weddingDate, { weeks: 2 }),
        dateType: TaskDateEnum.WEEKS_2,
        tasks: [
          'Go for final fitting',
          'Put together all party favors',
          'Confirm all transportation (limos, party buses, vehicles going to venues)',
          'Confirm photo session locations',
          'Put together your Doli playlist',
          'Pick out mehndi design',
          'Pack bag for wedding and reception day',
          'Pack wedding week emergency kit',
        ],
      },
      {
        date: sub(weddingDate, { weeks: 1 }),
        dateType: TaskDateEnum.WEEK,
        tasks: [
          'Make final payments',
          'Pick up all outfits',
          'Confirm guest count with caterers',
          'Make sure DJ knows slow dance song',
          'Confirm time with makeup artist',
          'Pick up signs and canvas',
        ],
      },
      {
        date: sub(weddingDate, { days: 5 }),
        dateType: TaskDateEnum.WEEK,
        tasks: [
          'Delegate tasks (Bride)',
          'Door signs and ribbons',
          'Taking the grooms shoes',
          'Rangoli design for sangeet',
          'Delegate tasks (Groom)',
          'Door signs and ribbons',
          'Rangoli design for sangeet',
          'Making sure you both are eating',
          'Get your engagement ring cleaned',
          'Cut all hanger loops off outfits',
        ],
      },
      {
        date: sub(weddingDate, { days: 3 }),
        dateType: TaskDateEnum.WEEK,
        tasks: [
          'Pick up all the sweets',
          'Practice speeches',
          'Give the guest book, cake knife, toasting glasses to whoever will be putting them out',
          'Assign someone to pick up wedding cake',
        ],
      },
      {
        date: sub(weddingDate, { days: 1 }),
        dateType: TaskDateEnum.WEEK,
        tasks: [
          'Get tents set up',
          'Get decorators to decorate bride and groom houses',
          'Practice dance performances',
          'Practice speeches',
          'Get manicure and pedicure',
          'Get Lots of rest!',
        ],
      },
    ];

    rawTasks.forEach((t) =>
      t.tasks.forEach((e) =>
        this.taskModel.create({
          user: new Types.ObjectId(user),
          name: e,
          dateType: t.dateType,
          activeAfter: t.date,
        }),
      ),
    );
  }

  async create(createTaskDto: Partial<TaskDocument>): Promise<TaskDocument> {
    return this.taskModel.create(createTaskDto);
  }

  async find(
    query: SearchTaskDto,
    meta: pagination,
  ): Promise<IFacetResult<TaskDocument>> {
    const filter: FilterQuery<TaskDocument> = {};

    if (query.user) filter.user = query.user;
    if (query.status) filter.status = { $in: query.status };
    if (query.dateType) filter.dateType = { $in: query.dateType };
    if (query.name)
      filter.name = {
        $regex: escapeRegexpString(query.name),
        $options: 'i',
      };

    //

    (query.activeAfterHb || query.activeAfterLb) && (filter.activeAfter = {});

    query.activeAfterHb && (filter.activeAfter.$lte = query.activeAfterHb);

    query.activeAfterLb && (filter.activeAfter.$gte = query.activeAfterLb);

    //
    return (
      await this.taskModel.aggregate([
        { $match: filter },
        ...facetTotalCount(meta),
      ])
    )[0];
  }

  async update(
    query: FilterQuery<TaskDocument>,
    data: UpdateQuery<TaskDocument>,
  ): Promise<any> {
    return this.taskModel.updateMany(query, data);
  }

  async delete(query: FilterQuery<TaskDocument>): Promise<any> {
    return this.taskModel.deleteMany(query);
  }

  async onUserDeleted(owner: Types.ObjectId) {
    await this.taskModel.deleteMany({ owner });
  }
}
