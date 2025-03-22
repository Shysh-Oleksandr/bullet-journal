import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  startDate?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsOptional()
  type?: Types.ObjectId | null;

  @IsArray()
  @IsOptional()
  category?: Types.ObjectId[];

  @IsArray()
  @IsOptional()
  images?: Types.ObjectId[];

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsBoolean()
  @IsOptional()
  isStarred?: boolean;
}
