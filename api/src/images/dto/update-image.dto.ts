import { IsMongoId, IsOptional, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateImageDto {
  @IsUrl()
  @IsOptional()
  url?: string;

  @IsMongoId()
  @IsOptional()
  noteId?: Types.ObjectId;
}
