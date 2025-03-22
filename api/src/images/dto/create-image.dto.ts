import { IsMongoId, IsOptional, IsString, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class CreateImageDto {
  @IsString()
  @IsUrl()
  url: string;

  @IsMongoId()
  @IsOptional()
  noteId?: Types.ObjectId;
}

export class CreateMultipleImagesDto {
  @IsString({ each: true })
  @IsUrl(undefined, { each: true })
  urls: string[];

  @IsMongoId()
  @IsOptional()
  noteId?: Types.ObjectId;
}
