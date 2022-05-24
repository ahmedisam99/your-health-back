import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_ROUTE_KEY } from '../constants/application-tokens';

export const IsPublicRoute = () => SetMetadata(IS_PUBLIC_ROUTE_KEY, true);
