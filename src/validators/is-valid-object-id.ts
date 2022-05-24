import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({ name: 'IsValidObjectId' })
@Injectable()
export class IsValidObjectId implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    try {
      return mongoose.Types.ObjectId.isValid(value);
    } catch (ignored) {
      return false;
    }
  }
}
