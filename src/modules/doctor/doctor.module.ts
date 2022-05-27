import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { Doctor, DoctorSchema } from 'schemas/doctor';
import { Post, PostSchema } from 'schemas/Post';
import { Comment, CommentSchema } from 'schemas/Comment';
import { hashPassword } from 'utils/hash-password.util';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '365d' },
      }),
    }),

    MongooseModule.forFeatureAsync([
      {
        name: Doctor.name,
        useFactory: () => {
          const schema = DoctorSchema;
          schema.pre('save', async function () {
            const doctor = this as Doctor;

            if (
              doctor.modifiedPaths().includes('password') &&
              doctor.password
            ) {
              doctor.password = await hashPassword(doctor.password);
            }
          });

          return schema;
        },
      },
      {
        name: Post.name,
        useFactory: () => PostSchema,
      },
      {
        name: Comment.name,
        useFactory: () => CommentSchema,
      },
    ]),
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}
