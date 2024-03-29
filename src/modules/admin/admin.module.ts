import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { Patient, PatientSchema } from 'schemas/patient';
import { Doctor, DoctorSchema } from 'schemas/doctor';
import { Admin, AdminSchema } from 'schemas/admin';
import { hashPassword } from 'utils/hash-password.util';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Post, PostSchema } from 'schemas/Post';
import { Comment, CommentSchema } from 'schemas/Comment';
import { Complaint, ComplaintSchema } from 'schemas/complaint';

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
        name: Admin.name,
        useFactory: () => {
          const schema = AdminSchema;
          schema.pre('save', async function () {
            const admin = this as Admin;

            if (admin.modifiedPaths().includes('password') && admin.password) {
              admin.password = await hashPassword(admin.password);
            }
          });

          return schema;
        },
      },
      {
        name: Complaint.name,
        useFactory: () => ComplaintSchema,
      },
      {
        name: Post.name,
        useFactory: () => PostSchema,
      },
      {
        name: Comment.name,
        useFactory: () => CommentSchema,
      },
      {
        name: Doctor.name,
        useFactory: () => DoctorSchema,
      },
      {
        name: Patient.name,
        useFactory: () => PatientSchema,
      },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
