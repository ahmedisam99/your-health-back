import { Model, PipelineStage } from 'mongoose';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Patient } from 'schemas/patient';
import { Post } from 'schemas/Post';
import { Comment } from 'schemas/Comment';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UserRoleEnum } from 'constants/user-role.enum';
import { CreateCommentDto } from 'modules/doctor/dtos/create-comment.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order } from 'schemas/Order';
import { Doctor } from 'schemas/doctor';
import { UpdateProfilePictureDto } from './dtos/update-profile-picture.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { MedicalProfile } from 'schemas/medical-profile';
import { UpdateMedicalProfileDto } from './dtos/update-medical-profile.dto';
import { Complaint } from 'schemas/complaint';
import { CreateComplaintDto } from './dtos/create-complaint.dto';

@Injectable()
export class PatientService {
  private logger = new Logger(PatientService.name);

  constructor(
    private jwtService: JwtService,

    @InjectModel(Patient.name)
    private patientModel: Model<Patient>,

    @InjectModel(Doctor.name)
    private doctorModel: Model<Doctor>,

    @InjectModel(Post.name)
    private postModel: Model<Post>,

    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,

    @InjectModel(Order.name)
    private orderModel: Model<Order>,

    @InjectModel(Complaint.name)
    private complaintModel: Model<Complaint>,

    @InjectModel(MedicalProfile.name)
    private medicalProfileModel: Model<MedicalProfile>,
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
          _id: patient._id,
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
      const patient = await this.patientModel.findById(user._id, [
        '_id',
        'name',
        'profilePicture',
        'email',
      ]);

      return {
        ...user,
        ...patient.toObject(),
      };
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

  async updateProfile(
    user: any,
    updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    try {
      await this.patientModel.updateOne({ _id: user._id }, updateProfileDto);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async updateProfilePicture(
    user: any,
    updateProfilePictureDto: UpdateProfilePictureDto,
  ): Promise<any> {
    try {
      const pat = await this.patientModel.findById(user._id, [
        'profilePicture',
      ]);

      if (!pat) throw new InternalServerErrorException();

      pat.profilePicture = updateProfilePictureDto.image;
      await pat.save();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getPosts(page: number): Promise<any> {
    try {
      const aggregationPipeLine: PipelineStage[] = [
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor',
            pipeline: [
              {
                $project: {
                  _id: true,
                  name: true,
                  profilePicture: true,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'postId',
            as: 'comments',
            pipeline: [
              {
                $lookup: {
                  from: 'doctors',
                  localField: 'doctorId',
                  foreignField: '_id',
                  as: 'doctor',
                  pipeline: [
                    {
                      $project: {
                        _id: true,
                        name: true,
                        profilePicture: true,
                      },
                    },
                  ],
                },
              },
              {
                $lookup: {
                  from: 'patients',
                  localField: 'patientId',
                  foreignField: '_id',
                  as: 'patient',
                  pipeline: [
                    {
                      $project: {
                        _id: true,
                        name: true,
                        profilePicture: true,
                      },
                    },
                  ],
                },
              },
              { $sort: { createdAt: -1 } },
              {
                $project: {
                  _id: true,
                  content: true,
                  createdAt: true,
                  doctor: {
                    $arrayElemAt: ['$doctor', 0],
                  },
                  patient: {
                    $arrayElemAt: ['$patient', 0],
                  },
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: true,
            doctor: {
              $arrayElemAt: ['$doctor', 0],
            },
            content: true,
            likes: true,
            createdAt: true,
            comments: true,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ];

      const posts = await this.postModel
        .aggregate(aggregationPipeLine)
        .skip((page - 1) * 10)
        .limit(10);

      const total = await this.postModel
        .aggregate(aggregationPipeLine)
        .count('total');

      return { posts, total: total?.[0]?.total || 0 };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async createComment(
    user: any,
    createCommentDto: CreateCommentDto,
  ): Promise<any> {
    try {
      const _comment = await this.commentModel.create({
        postId: createCommentDto.postId,
        patientId: user._id,
        content: createCommentDto.content,
      });

      const comment =
        (
          await this.commentModel.aggregate([
            {
              $match: {
                _id: _comment._id,
              },
            },
            {
              $lookup: {
                from: 'doctors',
                localField: 'doctorId',
                foreignField: '_id',
                as: 'doctor',
                pipeline: [
                  {
                    $project: {
                      _id: true,
                      name: true,
                      profilePicture: true,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: 'patients',
                localField: 'patientId',
                foreignField: '_id',
                as: 'patient',
                pipeline: [
                  {
                    $project: {
                      _id: true,
                      name: true,
                      profilePicture: true,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: true,
                content: true,
                createdAt: true,
                doctor: {
                  $arrayElemAt: ['$doctor', 0],
                },
                patient: {
                  $arrayElemAt: ['$patient', 0],
                },
              },
            },
          ])
        )?.[0] || {};

      return comment;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async likePost(postId: string) {
    try {
      const post = await this.postModel.findById(postId);

      if (post) {
        post.likes += 1;

        await post.save();
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async createOrder(user: any, createOrderDto: CreateOrderDto): Promise<any> {
    try {
      const order = await this.orderModel.create({
        patientId: user._id,
        ...createOrderDto,
      });

      return order;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getMyOrders(user: any): Promise<any> {
    try {
      const orders = await this.orderModel.aggregate([
        {
          $match: {
            patientId: user._id,
          },
        },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor',
            pipeline: [
              {
                $project: {
                  _id: true,
                  name: true,
                  profilePicture: true,
                  specialization: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: true,
            content: true,
            doctor: { $arrayElemAt: ['$doctor', 0] },
            createdAt: true,
          },
        },
      ]);

      return orders;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getDoctors(): Promise<any> {
    try {
      const doctors = await this.doctorModel.find({}, [
        '_id',
        'name',
        'profilePicture',
        'specialization',
        'email',
        'phoneNumber',
      ]);

      return doctors;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async cancelOrder(user: any, orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);

      if (order?.patientId?.toString() === user?._id?.toString()) {
        await order.remove();
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async getMedicalProfile(user: any): Promise<any> {
    try {
      const patient = await this.patientModel.findById(user._id, [
        '_id',
        'medicalProfileId',
      ]);

      const medicalProfile = await this.medicalProfileModel.findById(
        patient.medicalProfileId,
      );

      return medicalProfile || {};
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async updateMedicalProfile(
    user: any,
    updateMedicalProfileDto: UpdateMedicalProfileDto,
  ): Promise<any> {
    try {
      const patient = await this.patientModel.findById(user._id, [
        '_id',
        'medicalProfileId',
      ]);

      if (patient.medicalProfileId) {
        await this.medicalProfileModel.updateOne(
          { _id: patient.medicalProfileId },
          updateMedicalProfileDto,
        );
      } else {
        const medicalProfile = await this.medicalProfileModel.create(
          updateMedicalProfileDto,
        );

        patient.medicalProfileId = medicalProfile._id;
        await patient.save();
      }
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
            { $or: [{ fromModel: 'Patient' }, { toModel: 'Patient' }] },
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
        fromModel: 'Patient',
        to: '6259f7dc78e6ee2c49611c00',
        toModel: 'Admin',
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }
}
