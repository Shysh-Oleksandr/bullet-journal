import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { LabelFor } from '../custom-label.model';

export class CreateCustomLabelDto {
  @IsString()
  labelName: string;

  @IsString()
  color: string;

  // TODO: remove this field later
  @IsBoolean()
  @IsOptional()
  isCategoryLabel?: boolean;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsEnum(['Type', 'Category', 'Task'])
  labelFor: LabelFor;

  @IsMongoId()
  @IsOptional()
  refId?: Types.ObjectId;
}
