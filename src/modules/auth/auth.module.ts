import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PatientModule } from 'modules/patient/patient.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DoctorModule } from 'modules/doctor/doctor.module';
import { DoctorLocalStrategy } from './strategies/doctor-local.strategy';
import { PatientLocalStrategy } from './strategies/patient-local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '365d' },
      }),
    }),
    PatientModule,
    DoctorModule,
  ],
  controllers: [],
  providers: [DoctorLocalStrategy, PatientLocalStrategy, JwtStrategy],
  exports: [],
})
export class AuthModule {}
