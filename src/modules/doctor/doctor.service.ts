import { Model, PipelineStage } from 'mongoose';
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
import { Post } from 'schemas/Post';
import { Comment } from 'schemas/Comment';
import { CreatePostDto } from './dtos/create-post.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Order } from 'schemas/Order';

@Injectable()
export class DoctorService {
  private logger = new Logger(DoctorService.name);

  constructor(
    private jwtService: JwtService,

    @InjectModel(Doctor.name)
    private doctorModel: Model<Doctor>,

    @InjectModel(Post.name)
    private postModel: Model<Post>,

    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,

    @InjectModel(Order.name)
    private orderModel: Model<Order>,
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
      const doctor = await this.doctorModel.findById(user._id, [
        '_id',
        'name',
        'profilePicture',
      ]);

      return {
        ...user,
        ...doctor.toObject(),
      };
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

  async createPost(user: any, createPostDto: CreatePostDto): Promise<any> {
    try {
      const _post = await this.postModel.create({
        doctorId: user._id,
        content: createPostDto.content,
      });

      const post =
        (
          await this.postModel.aggregate([
            {
              $match: {
                _id: _post._id,
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
          ])
        )?.[0] || {};

      return post;
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
        doctorId: user._id,
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

  async getOrders(user: any): Promise<any> {
    try {
      const orders = await this.orderModel.aggregate([
        {
          $match: {
            doctorId: user._id,
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
                  address: true,
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
            patient: { $arrayElemAt: ['$patient', 0] },
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

  async getPatients(user: any): Promise<any> {
    const doctor = await this.doctorModel.aggregate([
      {
        $match: {
          _id: user._id,
        },
      },
      {
        $lookup: {
          from: 'patients',
          localField: 'patientsIds',
          foreignField: '_id',
          as: 'patients',
          pipeline: [
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
          ],
        },
      },
      {
        $project: {
          _id: true,
          patients: true,
        },
      },
    ]);

    return doctor?.[0]?.patients || [];
  }

  async removePatient(user: any, patientId: string) {
    try {
      const doctor = await this.doctorModel.findById(user._id);

      if (doctor) {
        doctor.patientsIds = doctor.patientsIds.filter(
          (id) => id.toString() !== patientId,
        );

        await doctor.save();
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async cancelOrder(user: any, orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);

      if (order?.doctorId?.toString() === user?._id?.toString()) {
        await order.remove();
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }

  async approveOrder(user: any, orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);
      const doctor = await this.doctorModel.findById(user._id);

      if (order?.doctorId?.toString() === doctor?._id?.toString()) {
        doctor.patientsIds = [...doctor.patientsIds, order.patientId];

        await doctor.save();
        await order.remove();
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('حدث خطأ ما');
    }
  }
}
