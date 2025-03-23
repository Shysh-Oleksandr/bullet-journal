import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  color: string;

  @IsMongoId()
  @IsOptional()
  parentGroupId?: Types.ObjectId;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @IsArray()
  @IsOptional()
  customLabels?: Types.ObjectId[];
}
