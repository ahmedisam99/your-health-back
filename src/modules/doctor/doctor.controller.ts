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
import { UserRoleEnum } from 'constants/user-role.enum';

import { IsPublicRoute } from 'decorators/is-public.decorator';
import { UserRoles } from 'decorators/user-roles.decorator';
import { DoctorLocalAuthGuard } from 'guards/doctor-local-auth.guard';
import { DoctorService } from './doctor.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateComplaintDto } from './dtos/create-complaint.dto';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdateProfilePictureDto } from './dtos/update-profile-picture.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

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
  @Put('profile')
  async updateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    return this.doctorService.updateProfile(req.user, updateProfileDto);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Put('profile-picture')
  async updateProfilePicture(
    @Req() req,
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
  ): Promise<any> {
    return this.doctorService.updateProfilePicture(
      req.user,
      updateProfilePictureDto,
    );
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('posts')
  async getPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<any> {
    return this.doctorService.getPosts(page);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('my-posts')
  async getMyPosts(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<any> {
    return this.doctorService.getMyPosts(req.user, page);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Post('posts')
  async createPost(
    @Req() req,
    @Body() createPostDto: CreatePostDto,
  ): Promise<any> {
    return this.doctorService.createPost(req.user, createPostDto);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Post('comments')
  async createComment(
    @Req() req,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<any> {
    return this.doctorService.createComment(req.user, createCommentDto);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('likes')
  async likePost(@Query('postId') postId: string): Promise<any> {
    return this.doctorService.likePost(postId);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('orders')
  async getOrders(@Req() req): Promise<any> {
    return this.doctorService.getOrders(req.user);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('orders/:orderId/cancel')
  async cancelOrder(
    @Req() req,
    @Param('orderId') orderId: string,
  ): Promise<any> {
    return this.doctorService.cancelOrder(req.user, orderId);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('orders/:orderId/approve')
  async approveOrder(
    @Req() req,
    @Param('orderId') orderId: string,
  ): Promise<any> {
    return this.doctorService.approveOrder(req.user, orderId);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('patients')
  async getPatients(@Req() req): Promise<any> {
    return this.doctorService.getPatients(req.user);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('patients/:patientId/remove')
  async removePatient(
    @Req() req,
    @Param('patientId') patientId: string,
  ): Promise<any> {
    return this.doctorService.removePatient(req.user, patientId);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('reports')
  async getReports(@Req() req): Promise<any> {
    return this.doctorService.getReports(req.user);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('pat-medical-profile')
  async getPatMedicalProfile(
    @Query('patientId') patientId: string,
  ): Promise<any> {
    return this.doctorService.getPatMedicalProfile(patientId);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Get('complaints')
  async getComplaints(@Req() req): Promise<any> {
    return this.doctorService.getComplaints(req.user);
  }

  @UserRoles(UserRoleEnum.Doctor)
  @Post('complaints')
  async createComplaint(
    @Req() req,
    @Body() createComplaintDto: CreateComplaintDto,
  ): Promise<any> {
    return this.doctorService.createComplaint(req.user, createComplaintDto);
  }
}
