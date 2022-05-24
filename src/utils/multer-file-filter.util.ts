import { BadRequestException } from '@nestjs/common';

export const multerImageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    callback(new BadRequestException(), false);
  }
};
