import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CountNotesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  dateFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  dateTo?: number;
}
