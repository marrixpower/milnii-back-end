import { rename } from 'fs';
import { extname } from 'path';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { createThumbnail } from '../util/thumbnail';

@Injectable({})
export class VideoThumbnailInterceptor implements NestInterceptor {
  private logger = new Logger(VideoThumbnailInterceptor.name);

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Request | any = context.switchToHttp().getRequest();

    let files = [];

    if (req.files) files = req.files;

    if (req.file) files = [req.file];

    if (!files && !files.length) return next.handle();

    for (const file of files) {
      if (file.mimetype.includes('video')) {
        this.createThumbnail(file);
      }
    }

    return next.handle();
  }

  private async createThumbnail(file) {
    this.logger.log(file);

    const thumb = await createThumbnail({
      path: file.path,
      mimetype: file.mimetype,
    });

    rename(
      'public/thumbnail/' + thumb,
      `public/thumbnail/${file.filename.split('.')[0]}${extname(
        thumb,
      ).toLowerCase()}`,
      console.log,
    );
  }
}
