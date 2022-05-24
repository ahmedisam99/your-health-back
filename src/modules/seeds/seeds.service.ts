import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as chalk from 'chalk';

import { Doctor } from 'schemas/doctor';
import { Patient } from 'schemas/patient';
import * as doctors from './data/doctors.json';
import * as patients from './data/patients.json';

@Injectable()
export class SeedsService {
  constructor(
    @InjectModel(Doctor.name)
    private doctorModel: Model<Doctor>,

    @InjectModel(Patient.name)
    private patientModel: Model<Patient>,
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

      console.log(chalk.cyan('[2] Seeding data...'));
      await this.doctorModel.create(doctors);
      await this.patientModel.create(patients);

      console.log(chalk.green('[3] Done...'));
    } catch (error) {
      console.log(chalk.bgRed('Error: '), chalk.red(error.message));
    }
  }

  @Command({
    command: 'seed:doc',
    describe: 'Seed Fake Categories Data',
  })
  async seedCategories() {
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
    describe: 'Seed Fake patients Data',
  })
  async seedFakeSubCategories() {
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
}
