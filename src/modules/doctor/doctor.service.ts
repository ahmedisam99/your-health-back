import { Model } from 'mongoose';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Doctor } from 'schemas/doctor';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { UserRoleEnum } from 'constants/user-role.enum';

@Injectable()
export class DoctorService {
  private logger = new Logger(DoctorService.name);

  constructor(
    private jwtService: JwtService,

    @InjectModel(Doctor.name)
    private doctorModel: Model<Doctor>,
  ) {}

  async getForJwtValidation(_id: string): Promise<any> {
    try {
      return await this.doctorModel.findById(_id, ['_id']);
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getForLogin(email: string): Promise<Doctor> {
    try {
      return await this.doctorModel.findOne({ email }, ['_id', 'password']);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async register(createDoctorDto: CreateDoctorDto): Promise<any> {
    try {
      const doesEmailExist = await this.doctorModel.findOne(
        {
          email: createDoctorDto.email,
        },
        ['_id'],
      );

      if (doesEmailExist) {
        throw new ConflictException('البريد الإلكتروني مستخدم');
      }

      const doctor = await this.doctorModel.create(createDoctorDto);

      return {
        accessToken: this.jwtService.sign({
          id: doctor._id,
          role: UserRoleEnum.Doctor,
        }),
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getMe(user: any): Promise<any> {
    try {
      return await this.doctorModel.findById(user._id, [
        '_id',
        'name',
        'profilePicture',
      ]);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getProfile(user: any): Promise<any> {
    try {
      return await this.doctorModel.findById(user._id, [
        '_id',
        'name',
        'email',
        'phoneNumber',
        'specialization',
        'profilePicture',
      ]);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }
}
