import { Model } from 'mongoose';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Patient } from 'schemas/patient';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UserRoleEnum } from 'constants/user-role.enum';

@Injectable()
export class PatientService {
  private logger = new Logger(PatientService.name);

  constructor(
    private jwtService: JwtService,

    @InjectModel(Patient.name)
    private patientModel: Model<Patient>,
  ) {}

  async getForJwtValidation(_id: string): Promise<any> {
    try {
      return await this.patientModel.findById(_id, ['_id']);
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getForLogin(email: string): Promise<Patient> {
    try {
      return await this.patientModel.findOne({ email }, ['_id', 'password']);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async register(createPatientDto: CreatePatientDto): Promise<any> {
    try {
      const doesEmailExist = await this.patientModel.findOne(
        {
          email: createPatientDto.email,
        },
        ['_id'],
      );

      if (doesEmailExist) {
        throw new ConflictException('البريد الإلكتروني مستخدم');
      }

      const patient = await this.patientModel.create(createPatientDto);

      return {
        accessToken: this.jwtService.sign({
          id: patient._id,
          role: UserRoleEnum.Patient,
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
      return await this.patientModel.findById(user._id, [
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
      return await this.patientModel.findById(user._id, [
        '_id',
        'name',
        'email',
        'phoneNumber',
        'profilePicture',
      ]);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }
}
