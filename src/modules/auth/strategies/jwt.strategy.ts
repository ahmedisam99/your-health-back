import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserRoleEnum } from 'constants/user-role.enum';
import { DoctorService } from 'modules/doctor/doctor.service';
import { PatientService } from 'modules/patient/patient.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (payload.role === UserRoleEnum.Doctor) {
      return this.validateDoctor(payload._id);
    } else if (payload.role === UserRoleEnum.Patient) {
      return this.validatePatient(payload._id);
    } else {
      throw new UnauthorizedException('غير مسموح لك بالدخول');
    }
  }

  private async validateDoctor(_id: string): Promise<any> {
    const doctor = await this.doctorService.getForJwtValidation(_id);

    if (!doctor) {
      throw new UnauthorizedException('غير مسموح لك بالدخول');
    }

    return {
      _id: doctor._id,
      role: UserRoleEnum.Doctor,
    };
  }

  private async validatePatient(_id: string): Promise<any> {
    const patient = await this.patientService.getForJwtValidation(_id);

    if (!patient) {
      throw new UnauthorizedException('غير مسموح لك بالدخول');
    }

    return {
      _id: patient._id,
      role: UserRoleEnum.Patient,
    };
  }
}
