import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

import { TaskDateEnum } from '../enum/task-date.enum';
import { TaskStatusEnum } from '../enum/task.enum';
export type TaskDocument = Task & Document;

@Schema({ timestamps: true, collection: Task.name })
export class Task {
  @Prop({ required: true })
  @ApiProperty()
  user: Types.ObjectId;

  @Prop({ default: 0 })
  @ApiProperty()
  increment: number;

  @Prop({ type: String, required: false })
  @ApiProperty({ type: String })
  name?: string;

  @Prop({ type: String, required: false })
  @ApiProperty({ type: String })
  description?: string;

  @Prop({ type: String, required: false })
  @ApiProperty({ type: String })
  budgetName?: string;

  @Prop({ type: Number, required: false })
  @ApiProperty({ type: Number })
  budget?: number;

  @Prop({ type: String, required: false })
  @ApiProperty({ enum: TaskDateEnum, type: String })
  dateType: TaskDateEnum;

  @Prop({})
  @ApiProperty()
  activeAfter: Date;

  @Prop({ default: TaskStatusEnum.NOT_DONE, enum: TaskStatusEnum })
  @ApiProperty({ enum: TaskStatusEnum })
  status?: TaskStatusEnum;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
