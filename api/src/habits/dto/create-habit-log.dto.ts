import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHabitLogDto {
  @IsNumber()
  date: number;

  @IsNumber()
  percentageCompleted: number;

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

  @IsString()
  habitId: string;
}
