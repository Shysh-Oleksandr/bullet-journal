import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../common/types';
import { PaginationDto } from './dto/pagination.dto';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      return await this.notesService.create(createNoteDto, req.user.userId);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create note');
    }
  }

  @Get('user')
  async findAll(@Req() req: RequestWithUser) {
    try {
      const notes = await this.notesService.findAll(req.user.userId);
      return notes;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch notes');
    }
  }

  @Get('paginated')
  async findAllPaginated(
    @Req() req: RequestWithUser,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      const { notes, total, totalPages } =
        await this.notesService.findAllPaginated(req.user.userId, page, limit);

      return {
        data: notes,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch paginated notes');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const note = await this.notesService.findOne(id);
      if (!note) {
        throw new NotFoundException('Note not found');
      }
      return { note };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch note');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    const updatedNote = await this.notesService.update(id, updateNoteDto);
    if (!updatedNote) {
      throw new NotFoundException('Note not found');
    }
    return { note: updatedNote };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.notesService.remove(id);
    if (!deleted) {
      throw new NotFoundException('Note not found');
    }
    return { message: 'Note was deleted.' };
  }
}
