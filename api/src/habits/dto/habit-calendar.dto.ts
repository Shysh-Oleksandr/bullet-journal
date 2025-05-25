import { IsOptional, IsString } from 'class-validator';

export class HabitCalendarQueryDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  month?: string;
}

export class CalendarDataItemDto {
  date: string;
  isOptional: boolean;
  streakState: {
    displayRightLine: boolean;
    displayLeftLine: boolean;
  };
  percentageCompleted: number;
  amount?: number;
  note?: string;
  isManuallyOptional: boolean;
}
