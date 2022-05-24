import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PatientService } from 'modules/patient/patient.service';
import { comparePassword } from 'utils/compare-password.util';
import { UserRoleEnum } from 'constants/user-role.enum';

@Injectable()
export class PatientLocalStrategy extends PassportStrategy(
  Strategy,
  'patient-local',
) {
  constructor(
    private jwtService: JwtService,
    private readonly patientService: PatientService,
  ) {
    super({ usernameField: 'email', passReqToCallback: false });
  }

  async validate(email: string, password: string): Promise<any> {
    const patient = await this.patientService.getForLogin(email);

    if (!patient) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const isPasswordCorrect = await comparePassword(password, patient.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    return {
      accessToken: this.jwtService.sign({
        _id: patient._id,
        role: UserRoleEnum.Patient,
      }),
    };
  }
}
