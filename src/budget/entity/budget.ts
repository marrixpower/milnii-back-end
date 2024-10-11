import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

import { BudgetStatusEnum } from '../enum/budget-status.enum';

export type BudgetDocument = Budget & Document;

@Schema({ timestamps: true, collection: Budget.name })
export class Budget {
  @ApiProperty({ type: String })
  _id?: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop()
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  estimatedCost: number;

  @ApiProperty()
  @Prop()
  finalCost: number;

  @ApiProperty()
  @Prop()
  note: string;

  @ApiProperty({ type: String })
  @Prop()
  group: Types.ObjectId;

  @ApiProperty({ enum: BudgetStatusEnum })
  @Prop({ enum: BudgetStatusEnum, default: BudgetStatusEnum.UNPAID })
  status: BudgetStatusEnum;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
