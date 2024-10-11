import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type BudgetGroupDocument = BudgetGroup & Document;

@Schema({ timestamps: true, collection: BudgetGroup.name })
export class BudgetGroup {
  @ApiProperty({ type: String })
  @Prop()
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop()
  name: string;
}

export const BudgetGroupSchema = SchemaFactory.createForClass(BudgetGroup);
