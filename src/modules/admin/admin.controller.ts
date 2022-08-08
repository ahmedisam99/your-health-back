import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRoleEnum } from 'constants/user-role.enum';

import { IsPublicRoute } from 'decorators/is-public.decorator';
import { UserRoles } from 'decorators/user-roles.decorator';
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

  @UserRoles(UserRoleEnum.Admin)
  @Get('me')
  async getMe(@Req() req): Promise<any> {
    return this.adminService.getMe(req.user);
  }

  @UserRoles(UserRoleEnum.Admin)
  @Get('patients')
  async getPatients(): Promise<any> {
    return this.adminService.getPatients();
  }

  @UserRoles(UserRoleEnum.Admin)
  @Delete('patients')
  async deletePatient(@Query('patientId') patientId: string): Promise<any> {
    return this.adminService.deletePatient(patientId);
  }

  @UserRoles(UserRoleEnum.Admin)
  @Get('doctors')
  async getDoctors(): Promise<any> {
    return this.adminService.getDoctors();
  }

  @UserRoles(UserRoleEnum.Admin)
  @Delete('doctors')
  async deleteDoctor(@Query('doctorId') doctorId: string): Promise<any> {
    return this.adminService.deleteDoctor(doctorId);
  }
}
