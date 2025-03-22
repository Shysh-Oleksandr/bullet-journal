import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note } from './note.model';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { SecurityService } from '../security/security.service';
import { ImagesService } from '../images/images.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    private securityService: SecurityService,
    private imagesService: ImagesService,
  ) {}

  private deobfuscateNotes(notes: Note | Note[]): void {
    const notesToProcess = Array.isArray(notes) ? notes : [notes];

    notesToProcess.forEach((note) => {
      if (note.title) {
        note.title = this.securityService.deobfuscateText(note.title);
      }

      if (note.content) {
        note.content = this.securityService.deobfuscateText(note.content);
      }
    });
  }

  private obfuscateNoteData(
    title?: string | null,
    content?: string | null,
  ): { title: string; content: string } {
    const obfTitle = title ? this.securityService.obfuscateText(title) : '';

    const obfContent = content
      ? this.securityService.obfuscateText(content)
      : '';

    return { title: obfTitle, content: obfContent };
  }

  async create(createNoteDto: CreateNoteDto, authorId: string): Promise<Note> {
    const { title: obfTitle, content: obfContent } = this.obfuscateNoteData(
      createNoteDto.title,
      createNoteDto.content,
    );

    const newNote = new this.noteModel({
      ...createNoteDto,
      title: obfTitle,
      content: obfContent,
      author: new Types.ObjectId(authorId),
      startDate: createNoteDto.startDate || new Date().getTime(),
      isLocked: false,
    });

    const savedNote = await newNote.save();

    // Update noteId for attached images
    if (createNoteDto.images && createNoteDto.images.length > 0) {
      const imageIds = createNoteDto.images.map((id) => id.toString());
      await this.imagesService.updateImagesNoteId(imageIds, savedNote.id);
    }

    // Deobfuscate before returning
    this.deobfuscateNotes(savedNote);

    return savedNote;
  }

  async createDefault(
    createNoteDto: CreateNoteDto,
    authorId: string,
  ): Promise<Note> {
    const now = new Date().getTime();
    const { title: obfTitle, content: obfContent } = this.obfuscateNoteData(
      createNoteDto.title,
      createNoteDto.content,
    );

    const newNote = new this.noteModel({
      ...createNoteDto,
      title: obfTitle,
      content: obfContent,
      author: new Types.ObjectId(authorId),
      startDate: now,
      isDefault: true,
    });

    const savedNote = await newNote.save();

    // Update noteId for attached images
    if (createNoteDto.images && createNoteDto.images.length > 0) {
      const imageIds = createNoteDto.images.map((id) => id.toString());
      await this.imagesService.updateImagesNoteId(imageIds, savedNote.id);
    }

    this.deobfuscateNotes(savedNote);

    return savedNote;
  }

  async findAll(authorId: string): Promise<Note[]> {
    const notes = await this.noteModel
      .find({ author: authorId })
      .populate('type')
      .populate('category')
      .populate('images')
      .exec();

    this.deobfuscateNotes(notes);

    return notes.sort((a, b) => b.startDate - a.startDate);
  }

  async findOne(id: string): Promise<Note | null> {
    const note = await this.noteModel
      .findById(id)
      .populate('type')
      .populate('category')
      .populate('images')
      .exec();

    if (!note) {
      return null;
    }

    this.deobfuscateNotes(note);

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note | null> {
    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      return null;
    }

    const updates: Record<string, any> = { ...updateNoteDto };

    // Only obfuscate title/content if they were provided in the update DTO
    if (
      updateNoteDto.title !== undefined ||
      updateNoteDto.content !== undefined
    ) {
      const obfuscated = this.obfuscateNoteData(
        updateNoteDto.title !== undefined ? updateNoteDto.title : null,
        updateNoteDto.content !== undefined ? updateNoteDto.content : null,
      );

      if (updateNoteDto.title !== undefined) {
        updates.title = obfuscated.title;
      }

      if (updateNoteDto.content !== undefined) {
        updates.content = obfuscated.content;
      }
    }

    const updatedNote = await this.noteModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();

    // Update the noteId of any images if they're provided in the update
    if (
      updatedNote &&
      updateNoteDto.images &&
      updateNoteDto.images.length > 0
    ) {
      const imageIds = updateNoteDto.images.map((id) => id.toString());
      await this.imagesService.updateImagesNoteId(imageIds, updatedNote.id);
    }

    if (updatedNote) {
      this.deobfuscateNotes(updatedNote);
    }

    return updatedNote;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.noteModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findAllPaginated(
    authorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ notes: Note[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      this.noteModel
        .find({ author: authorId })
        .populate('type')
        .populate('category')
        .populate('images')
        .sort({ startDate: -1 }) // Sort by startDate in descending order
        .skip(skip)
        .limit(limit)
        .exec(),
      this.noteModel.countDocuments({ author: authorId }).exec(),
    ]);

    this.deobfuscateNotes(notes);

    const totalPages = Math.ceil(total / limit);

    return { notes, total, totalPages };
  }
}
