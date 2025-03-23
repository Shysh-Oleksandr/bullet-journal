import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { TaskType } from '../task.model';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  dueDate?: number;

  @IsMongoId()
  @IsOptional()
  groupId?: Types.ObjectId;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  @IsNumber()
  @IsOptional()
  target?: number;

  @IsString()
  @IsOptional()
  units?: string;

  @IsNumber()
  @IsOptional()
  completedAmount?: number;

  @IsMongoId()
  @IsOptional()
  parentTaskId?: Types.ObjectId;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @IsNumber()
  @IsOptional()
  completedAt?: number;

  @IsArray()
  @IsOptional()
  customLabels?: Types.ObjectId[];
}
