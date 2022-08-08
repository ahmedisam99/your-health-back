import { Model } from 'mongoose';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Admin } from 'schemas/admin';
import { Doctor } from 'schemas/doctor';
import { Patient } from 'schemas/patient';

@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,

    @InjectModel(Doctor.name)
    private doctorModel: Model<Doctor>,

    @InjectModel(Patient.name)
    private patientModel: Model<Patient>,
  ) {}

  async getForJwtValidation(_id: string): Promise<any> {
    try {
      return await this.adminModel.findById(_id, ['_id']);
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getForLogin(email: string): Promise<Admin> {
    try {
      return await this.adminModel.findOne({ email }, ['_id', 'password']);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getMe(user: any): Promise<any> {
    try {
      const admin = await this.adminModel.findById(user._id, ['email']);

      return {
        ...user,
        ...admin.toObject(),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getPatients(): Promise<any> {
    try {
      const patients = await this.patientModel.aggregate([
        {
          $project: {
            _id: true,
            name: true,
            profilePicture: true,
            address: true,
            email: true,
            phoneNumber: true,
          },
        },
      ]);

      return patients || [];
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async deletePatient(patientId: string): Promise<any> {
    try {
      await this.patientModel.deleteOne({ _id: patientId });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getDoctors(): Promise<any> {
    try {
      const doctors = await this.doctorModel.aggregate([
        {
          $project: {
            _id: true,
            name: true,
            profilePicture: true,
            address: true,
            email: true,
            phoneNumber: true,
            specialization: true,
          },
        },
      ]);

      return doctors || [];
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async deleteDoctor(doctorId: string): Promise<any> {
    try {
      await this.doctorModel.deleteOne({ _id: doctorId });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }
}
