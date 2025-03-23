import { IsArray, IsString } from 'class-validator';

export class ReorderHabitsDto {
  @IsArray()
  @IsString({ each: true })
  habitIds: string[];
}
