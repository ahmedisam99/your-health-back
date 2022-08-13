import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';

import { Admin, AdminSchema } from 'schemas/admin';
import { Doctor, DoctorSchema } from 'schemas/doctor';
import { Patient, PatientSchema } from 'schemas/patient';
import { Comment, CommentSchema } from 'schemas/Comment';
import { Post, PostSchema } from 'schemas/Post';
import { SeedsService } from './seeds.service';
import { Complaint, ComplaintSchema } from 'schemas/complaint';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Complaint.name,
        schema: ComplaintSchema,
      },
      {
        name: Admin.name,
        schema: AdminSchema,
      },
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
