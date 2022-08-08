import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PatientModule } from 'modules/patient/patient.module';
import { AdminModule } from 'modules/admin/admin.module';
import { DoctorModule } from 'modules/doctor/doctor.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DoctorLocalStrategy } from './strategies/doctor-local.strategy';
import { PatientLocalStrategy } from './strategies/patient-local.strategy';
import { AdminLocalStrategy } from './strategies/admin-local.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '365d' },
      }),
    }),
    PassportModule,
    AdminModule,
    PatientModule,
    DoctorModule,
  ],
  controllers: [],
  providers: [
    AdminLocalStrategy,
    DoctorLocalStrategy,
    PatientLocalStrategy,
    JwtStrategy,
  ],
  exports: [],
})
export class AuthModule {}
