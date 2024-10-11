import { extname } from 'path';

import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';

export function multerOptions(folder: string): MulterOptions {
  return {
    storage: diskStorage({
      destination: './public/' + folder,
      filename: (req, file, cb) => {
        cb(
          null,
          new Types.ObjectId().toString() +
            extname(file.originalname).toLowerCase(),
        );
      },
    }),
    fileFilter: (req, file, cb) => {
      return cb(null, true);

      const isAllowed =
        /doc|docx|xls|xlsx|pdf|jpg|jpeg|png|heic|heif|mp4|mpeg/.test(
          file.mimetype,
        );

      if (!isAllowed) {
        cb(
          new Error(
            'Only doc, docx, xls, xlsx, pdf, jpg, jpeg, png, heic, heif, mp4, mpeg files are allowed!',
          ),
          false,
        );
      }
      if (file.size > 1024 * 1024 * 5) {
        cb(new Error('File size must be less than 5MB!'), false);
      }

      return cb(null, true);
    },
  };
}
