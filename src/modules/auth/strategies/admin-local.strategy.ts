import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { comparePassword } from 'utils/compare-password.util';
import { UserRoleEnum } from 'constants/user-role.enum';
import { AdminService } from 'modules/admin/admin.service';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'admin-local',
) {
  constructor(
    private jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {
    super({ usernameField: 'email', passReqToCallback: false });
  }

  async validate(email: string, password: string): Promise<any> {
    const admin = await this.adminService.getForLogin(email);

    if (!admin) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const isPasswordCorrect = await comparePassword(password, admin.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    return {
      accessToken: this.jwtService.sign({
        _id: admin._id,
        role: UserRoleEnum.Admin,
      }),
    };
  }
}
