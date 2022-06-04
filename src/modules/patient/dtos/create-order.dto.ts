import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId({ message: 'رقم معرف غير صحيح' })
  doctorId: string;

  @IsString({
    message: 'يجب أن يكون المحتوى نص',
  })
  @IsNotEmpty({
    message: 'يجب أن لا يكون المحتوى فارغ',
  })
  content: string;
}
