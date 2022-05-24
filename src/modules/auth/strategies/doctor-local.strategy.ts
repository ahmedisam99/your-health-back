import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DoctorService } from 'modules/doctor/doctor.service';
import { comparePassword } from 'utils/compare-password.util';
import { UserRoleEnum } from 'constants/user-role.enum';

@Injectable()
export class DoctorLocalStrategy extends PassportStrategy(
  Strategy,
  'doctor-local',
) {
  constructor(
    private jwtService: JwtService,
    private readonly doctorService: DoctorService,
  ) {
    super({ usernameField: 'email', passReqToCallback: false });
  }

  async validate(email: string, password: string): Promise<any> {
    const doctor = await this.doctorService.getForLogin(email);

    if (!doctor) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const isPasswordCorrect = await comparePassword(password, doctor.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    return {
      accessToken: this.jwtService.sign({
        _id: doctor._id,
        role: UserRoleEnum.Doctor,
      }),
    };
  }
}
