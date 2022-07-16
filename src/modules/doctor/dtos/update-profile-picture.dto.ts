import { IsUrl } from 'class-validator';

export class UpdateProfilePictureDto {
  @IsUrl({}, { message: 'يجب أن تكون الصورة عبارة عن رابط صحيح' })
  image: string;
}
