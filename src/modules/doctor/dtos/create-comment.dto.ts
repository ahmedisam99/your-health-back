import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsMongoId({ message: 'رقم معرف غير صحيح' })
  postId: string;

  @IsString({
    message: 'يجب أن يكون المحتوى نص',
  })
  @IsNotEmpty({
    message: 'يجب أن لا يكون المحتوى فارغ',
  })
  content: string;
}
