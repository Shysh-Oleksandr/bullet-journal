import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HabitPeriod, HabitType } from '../habit.model';
import { CreateHabitLogDto } from './create-habit-log.dto';

export class HabitFrequencyDto {
  @IsNumber()
  @IsOptional()
  days?: number;

  @IsEnum(HabitPeriod)
  @IsOptional()
  period?: HabitPeriod;
}

export class CreateHabitDto {
  @IsString()
  label: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  streakTarget?: number;

  @IsNumber()
  @IsOptional()
  overallTarget?: number;

  @IsNumber()
  @IsOptional()
  amountTarget?: number;

  @IsString()
  @IsOptional()
  units?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => HabitFrequencyDto)
  frequency?: HabitFrequencyDto;

  @IsEnum(HabitType)
  @IsOptional()
  habitType?: HabitType;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateHabitLogDto)
  logs?: CreateHabitLogDto[];
}
