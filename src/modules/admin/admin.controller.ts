import { Controller, Post, Req, UseGuards } from '@nestjs/common';

import { IsPublicRoute } from 'decorators/is-public.decorator';
import { AdminLocalAuthGuard } from 'guards/admin-local-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @IsPublicRoute()
  @UseGuards(AdminLocalAuthGuard)
  @Post('login')
  async login(@Req() req): Promise<any> {
    return req.user;
  }
}
