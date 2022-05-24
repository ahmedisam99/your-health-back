import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { IsValidPhoneNumber } from 'validators/is-valid-phone-number';

export class CreateDoctorDto {
  @IsString({
    message: 'يجب أن يكون الاسم نصياً',
  })
  @IsNotEmpty({
    message: 'يجب ألا يكون الاسم فارغاً',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'يجب أن يكون البريد الإلكتروني صحيحاً',
    },
  )
  email: string;

  @Length(8, 20, {
    message: 'يجب أن تكون كلمة المرور بين 8 و 20 حرفاً',
  })
  password: string;

  @Validate(IsValidPhoneNumber, {
    message: 'يجب أن يكون رقم الهاتف صحيحاً',
  })
  phoneNumber: string;
}
