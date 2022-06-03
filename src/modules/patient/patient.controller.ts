import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PatientLocalAuthGuard } from 'guards/patient-local-auth.guard';
import { IsPublicRoute } from 'decorators/is-public.decorator';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UserRoles } from 'decorators/user-roles.decorator';
import { UserRoleEnum } from 'constants/user-role.enum';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @IsPublicRoute()
  @UseGuards(PatientLocalAuthGuard)
  @Post('login')
  async login(@Req() req): Promise<any> {
    return req.user;
  }

  @IsPublicRoute()
  @Post('register')
  async register(@Body() createPatientDto: CreatePatientDto): Promise<any> {
    return this.patientService.register(createPatientDto);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Get('me')
  async getMe(@Req() req): Promise<any> {
    return this.patientService.getMe(req.user);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Get('profile')
  async getProfile(@Req() req): Promise<any> {
    return this.patientService.getProfile(req.user);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Get('posts')
  async getPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<any> {
    return this.patientService.getPosts(page);
  }
}
