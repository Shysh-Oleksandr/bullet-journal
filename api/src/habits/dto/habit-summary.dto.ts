import { IsOptional, IsString } from 'class-validator';

export class HabitSummaryQueryDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  userId?: string; // Workaround for the web app TODO: remove it
}
