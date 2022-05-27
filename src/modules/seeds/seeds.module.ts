import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';

import { Comment, CommentSchema } from 'schemas/Comment';
import { Doctor, DoctorSchema } from 'schemas/doctor';
import { Patient, PatientSchema } from 'schemas/patient';
import { Post, PostSchema } from 'schemas/Post';
import { SeedsService } from './seeds.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Doctor.name,
        schema: DoctorSchema,
      },
      {
        name: Patient.name,
        schema: PatientSchema,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),

    CommandModule,
  ],
  providers: [SeedsService],
})
export class SeedsModule {}
