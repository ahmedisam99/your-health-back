import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { CreateCommentDto } from 'modules/doctor/dtos/create-comment.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateProfilePictureDto } from './dtos/update-profile-picture.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UpdateMedicalProfileDto } from './dtos/update-medical-profile.dto';
import { CreateComplaintDto } from './dtos/create-complaint.dto';

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
  @Put('profile')
  async updateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    return this.patientService.updateProfile(req.user, updateProfileDto);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Put('profile-picture')
  async updateProfilePicture(
    @Req() req,
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
  ): Promise<any> {
    return this.patientService.updateProfilePicture(
      req.user,
      updateProfilePictureDto,
    );
  }

  @UserRoles(UserRoleEnum.Patient)
  @Get('posts')
  async getPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<any> {
    return this.patientService.getPosts(page);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Post('comments')
  async createComment(
    @Req() req,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<any> {
    return this.patientService.createComment(req.user, createCommentDto);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Get('likes')
  async likePost(@Query('postId') postId: string): Promise<any> {
    return this.patientService.likePost(postId);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Post('orders')
  async createOrder(
    @Req() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<any> {
    return this.patientService.createOrder(req.user, createOrderDto);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Get('orders')
  async getMyOrders(@Req() req): Promise<any> {
    return this.patientService.getMyOrders(req.user);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Get('orders/:orderId/cancel')
  async cancelOrder(
    @Req() req,
    @Param('orderId') orderId: string,
  ): Promise<any> {
    return this.patientService.cancelOrder(req.user, orderId);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Get('doctors')
  async getDoctors(): Promise<any> {
    return this.patientService.getDoctors();
  }

  @UserRoles(UserRoleEnum.Patient)
  @Get('medical-profile')
  async getMedicalProfile(@Req() req): Promise<any> {
    return this.patientService.getMedicalProfile(req.user);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Put('medical-profile')
  async updateMedicalProfile(
    @Req() req,
    @Body() updateMedicalProfileDto: UpdateMedicalProfileDto,
  ): Promise<any> {
    return this.patientService.updateMedicalProfile(
      req.user,
      updateMedicalProfileDto,
    );
  }

  @UserRoles(UserRoleEnum.Patient)
  @Get('complaints')
  async getComplaints(@Req() req): Promise<any> {
    return this.patientService.getComplaints(req.user);
  }

  @UserRoles(UserRoleEnum.Patient)
  @Post('complaints')
  async createComplaint(
    @Req() req,
    @Body() createComplaintDto: CreateComplaintDto,
  ): Promise<any> {
    return this.patientService.createComplaint(req.user, createComplaintDto);
  }
}
