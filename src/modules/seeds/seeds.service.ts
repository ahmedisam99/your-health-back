import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as chalk from 'chalk';

import { Doctor } from 'schemas/doctor';
import { Patient } from 'schemas/patient';
import { Post } from 'schemas/Post';
import { Comment } from 'schemas/Comment';
import * as doctors from './data/doctors.json';
import * as patients from './data/patients.json';
import * as posts from './data/posts.json';
import * as comments from './data/comments.json';

@Injectable()
export class SeedsService {
  constructor(
    @InjectModel(Doctor.name)
    private doctorModel: Model<Doctor>,

    @InjectModel(Patient.name)
    private patientModel: Model<Patient>,

    @InjectModel(Post.name)
    private postModel: Model<Post>,

    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
  ) {}

  @Command({
    command: 'seed:all',
    describe: 'Seed All',
  })
  async seedAll() {
    try {
      console.log(chalk.cyan('[1] Cleaning up...'));
      await this.doctorModel.deleteMany({});
      await this.patientModel.deleteMany({});
      await this.postModel.deleteMany({});
      await this.commentModel.deleteMany({});

      console.log(chalk.cyan('[2] Seeding data...'));
      await this.doctorModel.create(doctors);
      await this.patientModel.create(patients);
      await this.postModel.create(posts);
      await this.commentModel.create(comments);

      console.log(chalk.green('[3] Done...'));
    } catch (error) {
      console.log(chalk.bgRed('Error: '), chalk.red(error.message));
    }
  }

  @Command({
    command: 'seed:doc',
    describe: 'Seed Doctors Data',
  })
  async seedDoctors() {
    try {
      console.log(chalk.cyan('[1] Cleaning up...'));
      await this.doctorModel.deleteMany({});

      console.log(chalk.cyan('[2] Seeding data...'));
      await this.doctorModel.create(doctors);

      console.log(chalk.green('[3] Done...'));
    } catch (error) {
      console.log(chalk.bgRed('Error: '), chalk.red(error.message));
    }
  }

  @Command({
    command: 'seed:pat',
    describe: 'Seed patients Data',
  })
  async seedPatients() {
    try {
      console.log(chalk.cyan('[1] Cleaning up...'));
      await this.patientModel.deleteMany({});

      console.log(chalk.cyan('[2] Seeding data...'));
      await this.patientModel.create(patients);

      console.log(chalk.green('[3] Done...'));
    } catch (error) {
      console.log(chalk.bgRed('Error: '), chalk.red(error.message));
    }
  }

  @Command({
    command: 'seed:posts',
    describe: 'Seed Posts Data',
  })
  async seedPosts() {
    try {
      console.log(chalk.cyan('[1] Cleaning up...'));
      await this.postModel.deleteMany({});

      console.log(chalk.cyan('[2] Seeding data...'));
      await this.postModel.create(posts);

      console.log(chalk.green('[3] Done...'));
    } catch (error) {
      console.log(chalk.bgRed('Error: '), chalk.red(error.message));
    }
  }

  @Command({
    command: 'seed:comments',
    describe: 'Seed Comments Data',
  })
  async seedComments() {
    try {
      console.log(chalk.cyan('[1] Cleaning up...'));
      await this.commentModel.deleteMany({});

      console.log(chalk.cyan('[2] Seeding data...'));
      await this.commentModel.create(comments);

      console.log(chalk.green('[3] Done...'));
    } catch (error) {
      console.log(chalk.bgRed('Error: '), chalk.red(error.message));
    }
  }
}
