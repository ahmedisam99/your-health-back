import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateComplaintDto {
  @IsMongoId({ message: 'رقم معرف غير صحيح' })
  to: string;

  @IsString({
    message: 'يجب أن يكون المحتوى نص',
  })
  @IsNotEmpty({
    message: 'يجب أن لا يكون المحتوى فارغ',
  })
  toModel: string;

  @IsString({
    message: 'يجب أن يكون المحتوى نص',
  })
  @IsNotEmpty({
    message: 'يجب أن لا يكون المحتوى فارغ',
  })
  content: string;
}
