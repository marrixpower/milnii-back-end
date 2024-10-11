import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ autoCreate: false })
export class File {
  @Prop()
  @ApiProperty({})
  creationDate?: string;

  @Prop()
  @ApiProperty({})
  duration?: number;

  @Prop()
  @ApiProperty({})
  extension?: string;

  @Prop()
  @ApiProperty({})
  height?: number;

  @Prop()
  @ApiProperty({})
  size?: number;

  @Prop()
  @ApiProperty({})
  width?: number;

  @Prop()
  @ApiProperty({})
  thumbnail?: string;

  @Prop()
  @ApiProperty({})
  filename?: string;

  @Prop({ required: false })
  @ApiProperty({})
  displayName?: string;

  @Prop()
  @ApiProperty({})
  originalFilename?: string;
}
export const FileSchema = SchemaFactory.createForClass(File);
