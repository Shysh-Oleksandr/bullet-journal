export interface CustomLabel {
  _id: string;
  labelName: string;
  color: string;
  labelFor?: string;
  isCategoryLabel?: boolean;
  refId?: string;
}

export interface Image {
  _id: string;
  url: string;
  author: string;
  noteId?: string;
}

export interface Note {
  _id: string;
  author: string;
  title: string;
  content: string;
  color: string;
  startDate: number;
  rating: number;
  isLocked: boolean;
  isStarred: boolean;
  images: Image[];
  type: CustomLabel | null;
  category: CustomLabel[];
}

export interface CreateNoteRequest {
  title: string;
  content?: string;
  startDate?: number;
  color?: string;
  type?: string | null;
  category?: string[];
  images?: string[];
  rating?: number;
  isStarred?: boolean;
}

export interface UpdateNoteRequest extends CreateNoteRequest {
  isLocked?: boolean;
}
