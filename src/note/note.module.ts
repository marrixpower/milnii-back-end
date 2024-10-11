import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Note, NoteSchema } from './entity/note';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Note.name,
        schema: NoteSchema,
      },
    ]),
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
