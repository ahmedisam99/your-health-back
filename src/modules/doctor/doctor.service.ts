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
      await this.postModel.create({
        doctorId: user._id,
        content: createPostDto.content,
      });
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
      const comment = await this.commentModel.create({
        postId: createCommentDto.postId,
        doctorId: user._id,
        content: createCommentDto.content,
      });

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
}
