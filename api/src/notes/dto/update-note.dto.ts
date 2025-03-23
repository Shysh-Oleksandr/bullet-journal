import { CreateNoteDto } from './create-note.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNoteDto extends CreateNoteDto {
  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;
}
