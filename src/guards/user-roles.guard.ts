import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { USER_ROLES_KEY } from 'constants/application-tokens';
import { UserRoleEnum } from 'constants/user-role.enum';

@Injectable()
export class UserRolesGuard implements CanActivate {
  private logger = new Logger(UserRolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      USER_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!allowedRoles) {
      return true;
    }

    const { user }: { user: any } = context.switchToHttp().getRequest();

    if (!user) {
      this.logger.error({
        path: 'guards/user-roles.guard',
        message: "Can't use 'UserRolesDecorator' decorator on a public route",
      });

      throw new InternalServerErrorException();
    }

    return allowedRoles.includes(user.role);
  }
}
