import { IsOptional, IsString } from 'class-validator';

export class HabitSummaryQueryDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
