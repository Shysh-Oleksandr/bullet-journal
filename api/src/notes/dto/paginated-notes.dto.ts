import { Note } from '../note.model';

export class PaginatedNotesDto {
  data: Note[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
