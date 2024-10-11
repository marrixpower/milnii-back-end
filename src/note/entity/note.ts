import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true, collection: Note.name })
export class Note {
  @Prop()
  @ApiProperty()
  owner: Types.ObjectId;

  @ApiProperty()
  @Prop()
  text: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
