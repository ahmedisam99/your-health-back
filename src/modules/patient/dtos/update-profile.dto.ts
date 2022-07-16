import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsValidPhoneNumber } from 'validators/is-valid-phone-number';

export class UpdateProfileDto {
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

  @Validate(IsValidPhoneNumber, {
    message: 'يجب أن يكون رقم الهاتف صحيحاً',
  })
  phoneNumber: string;
}
