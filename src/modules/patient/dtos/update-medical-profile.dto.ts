import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsValidPhoneNumber } from 'validators/is-valid-phone-number';

export class UpdateMedicalProfileDto {
  @IsString({
    message: 'يجب أن يكون الاسم نصياً',
  })
  @IsNotEmpty({
    message: 'يجب ألا يكون الاسم فارغاً',
  })
  name: string;

  @IsString({
    message: 'يجب أن يكون اسم الأب نصياً',
  })
  @IsNotEmpty({
    message: 'يجب ألا يكون اسم الأب فارغاً',
  })
  middleName: string;

  @IsString({
    message: 'يجب أن يكون اسم الجد نصياً',
  })
  @IsNotEmpty({
    message: 'يجب ألا يكون اسم الجد فارغاً',
  })
  grandFatherName: string;

  @IsString({
    message: 'يجب أن يكون اسم العائلة نصياً',
  })
  @IsNotEmpty({
    message: 'يجب ألا يكون اسم العائلة فارغاً',
  })
  lastName: string;

  @IsEnum(['m', 'f'])
  gender: string;

  @Validate(IsValidPhoneNumber, {
    message: 'يجب أن يكون رقم الهاتف صحيحاً',
  })
  phoneNumber: string;

  @Type(() => Date)
  @IsDate({ message: 'يجب أن يكون تاريخ الميلاد صحيح' })
  birthDate: Date;

  @IsString({
    message: 'يجب أن يكون رقم الهوية نصياً',
  })
  @IsNotEmpty({
    message: 'يجب ألا يكون رقم الهوية فارغاً',
  })
  idNumber: string;

  @IsString({
    message: 'يجب أن يكون اسم المدينة نصياً',
  })
  @IsNotEmpty({
    message: 'يجب ألا يكون اسم المدينة فارغاً',
  })
  city: string;

  @IsString({
    message: 'يجب أن يكون اسم الحي/الشارع نصياً',
  })
  @IsNotEmpty({
    message: 'يجب ألا يكون اسم الحي/الشارع فارغاً',
  })
  street: string;

  @IsString({
    message: 'يجب أن يكون اسم مدينة الميلاد نصياً',
  })
  @IsNotEmpty({
    message: 'يجب ألا يكون اسم مدينة الميلاد فارغاً',
  })
  birthCity: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'يجب أن يكون البريد الإلكتروني صحيحاً',
    },
  )
  email: string;
}
