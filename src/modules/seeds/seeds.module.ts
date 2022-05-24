import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';

import { Doctor, DoctorSchema } from 'schemas/doctor';
import { Patient, PatientSchema } from 'schemas/patient';
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
    ]),

    CommandModule,
  ],
  providers: [SeedsService],
})
export class SeedsModule {}
