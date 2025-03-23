import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateHabitLogDto {
  @IsNumber()
  @IsOptional()
  date?: number;

  @IsNumber()
  @IsOptional()
  percentageCompleted?: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsOptional()
  amountTarget?: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsBoolean()
  @IsOptional()
  isManuallyOptional?: boolean;
}
