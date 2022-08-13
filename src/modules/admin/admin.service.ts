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
import { Post } from 'schemas/Post';
import { Comment } from 'schemas/Comment';
import { CreateComplaintDto } from './create-complaint.dto';
import { Complaint } from 'schemas/complaint';

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

    @InjectModel(Post.name)
    private postModel: Model<Post>,

    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,

    @InjectModel(Complaint.name)
    private complaintModel: Model<Complaint>,
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
      await this.commentModel.deleteMany({ patientId: patientId });
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
      await this.postModel.deleteMany({ doctorId: doctorId });
      await this.commentModel.deleteMany({ doctorId: doctorId });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getComplaints(user: any): Promise<any> {
    try {
      const complaints = await this.complaintModel
        .find({
          $and: [
            { $or: [{ from: user._id }, { to: user._id }] },
            { $or: [{ fromModel: 'Admin' }, { toModel: 'Admin' }] },
          ],
        })
        .populate('from', { password: false })
        .populate('to', { password: false })
        .sort({ createdAt: -1 });

      return complaints;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async createComplaint(
    user: any,
    createComplaintDto: CreateComplaintDto,
  ): Promise<any> {
    try {
      await this.complaintModel.create({
        ...createComplaintDto,
        from: user._id,
        fromModel: 'Admin',
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }
}
