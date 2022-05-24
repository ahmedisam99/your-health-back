import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { Patient, PatientSchema } from 'schemas/patient';
import { hashPassword } from 'utils/hash-password.util';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

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
        name: Patient.name,
        useFactory: () => {
          const schema = PatientSchema;
          schema.pre('save', async function () {
            const patient = this as Patient;

            if (
              patient.modifiedPaths().includes('password') &&
              patient.password
            ) {
              patient.password = await hashPassword(patient.password);
            }
          });

          return schema;
        },
      },
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
