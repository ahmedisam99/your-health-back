import { SetMetadata } from '@nestjs/common';

import { UserRoleEnum } from 'constants/user-role.enum';
import { USER_ROLES_KEY } from 'constants/application-tokens';

export const UserRoles = (...allowedRoles: UserRoleEnum[]) =>
  SetMetadata(USER_ROLES_KEY, allowedRoles);
