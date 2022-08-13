import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComplaintDto {
  @IsString({
    message: 'يجب أن يكون المحتوى نص',
  })
  @IsNotEmpty({
    message: 'يجب أن لا يكون المحتوى فارغ',
  })
  content: string;
}
