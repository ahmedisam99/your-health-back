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
import { UserRoleEnum } from 'constants/user-role.enum';

import { IsPublicRoute } from 'decorators/is-public.decorator';
import { UserRoles } from 'decorators/user-roles.decorator';
import { DoctorLocalAuthGuard } from 'guards/doctor-local-auth.guard';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dtos/create-doctor.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @IsPublicRoute()
  @UseGuards(DoctorLocalAuthGuard)
  @Post('login')
  async login(@Req() req): Promise<any> {
    return req.user;
  }

  @IsPublicRoute()
  @Post('register')
  async register(@Body() createDoctorDto: CreateDoctorDto): Promise<any> {
    return this.doctorService.register(createDoctorDto);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('me')
  async getMe(@Req() req): Promise<any> {
    return this.doctorService.getMe(req.user);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('profile')
  async getProfile(@Req() req): Promise<any> {
    return this.doctorService.getProfile(req.user);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('posts')
  async getPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<any> {
    return this.doctorService.getPosts(page);
  }
}
