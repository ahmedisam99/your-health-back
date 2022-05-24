import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'IsValidPhoneNumber' })
@Injectable()
export class IsValidPhoneNumber implements ValidatorConstraintInterface {
  validate(phoneNumber: string): boolean {
    try {
      return isValidPhoneNumber(phoneNumber);
    } catch (ignored) {
      return false;
    }
  }
}
