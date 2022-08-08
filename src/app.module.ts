import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as Joi from 'joi';

import { multerImageFileFilter } from 'utils/multer-file-filter.util';
import { AuthModule } from 'modules/auth/auth.module';
import { SeedsModule } from 'modules/seeds/seeds.module';
import { PatientModule } from 'modules/patient/patient.module';
import { DoctorModule } from 'modules/doctor/doctor.module';
import { AdminModule } from 'modules/admin/admin.module';

@Module({
  imports: [
    // config module
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(7425),
        JWT_SECRET: Joi.string().required(),
        BCRYPT_SALT_ROUNDS: Joi.number().default(10),
        MONGO_URI: Joi.string().required(),
      }),
    }),

    // mongoose module
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
      }),
    }),

    // multer module
    MulterModule.register({
      storage: multer.diskStorage({
        destination: (_, __, cb) => {
          const path = 'upload';
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
          }

          cb(null, path);
        },
        filename: (_, file, cb) => {
          cb(null, Date.now() + path.extname(file.originalname));
        },
      }),
      fileFilter: multerImageFileFilter,
    }),

    // serve static modules
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'upload'),
      serveRoot: '/upload',
    }),

    // local modules
    AuthModule,
    PatientModule,
    DoctorModule,
    AdminModule,

    // seeds module
    SeedsModule,
  ],
})
export class AppModule {}
