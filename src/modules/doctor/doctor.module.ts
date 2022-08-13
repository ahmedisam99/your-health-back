import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { Doctor, DoctorSchema } from 'schemas/doctor';
import { Post, PostSchema } from 'schemas/Post';
import { Comment, CommentSchema } from 'schemas/Comment';
import { hashPassword } from 'utils/hash-password.util';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Order, OrderSchema } from 'schemas/Order';
import { Patient, PatientSchema } from 'schemas/patient';
import { MedicalProfile, MedicalProfileSchema } from 'schemas/medical-profile';
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
        name: Complaint.name,
        useFactory: () => ComplaintSchema,
      },
      {
        name: MedicalProfile.name,
        useFactory: () => MedicalProfileSchema,
      },
      {
        name: Patient.name,
        useFactory: () => PatientSchema,
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
        name: Order.name,
        useFactory: () => OrderSchema,
      },
    ]),
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}
