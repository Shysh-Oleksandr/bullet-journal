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
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../common/types';
import { ReorderHabitsDto } from './dto/reorder-habits.dto';

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  async create(
    @Body() createHabitDto: CreateHabitDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const habit = await this.habitsService.create(
        createHabitDto,
        req.user.userId,
      );
      return { habit };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create habit');
    }
  }

  @Post('reorder')
  async reorder(@Body() reorderHabitsDto: ReorderHabitsDto) {
    try {
      const success = await this.habitsService.reorderHabits(
        reorderHabitsDto.habitIds,
      );
      if (!success) {
        throw new BadRequestException('Failed to reorder habits');
      }
      return { message: 'Habits reordered successfully' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to reorder habits');
    }
  }

  @Get()
  async findAll(@Req() req: RequestWithUser) {
    try {
      const habits = await this.habitsService.findAll(req.user.userId);
      return habits;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch habits');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const habit = await this.habitsService.findOne(id);
      if (!habit) {
        throw new NotFoundException('Habit not found');
      }
      return { habit };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch habit');
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    try {
      const updatedHabit = await this.habitsService.update(id, updateHabitDto);
      if (!updatedHabit) {
        throw new NotFoundException('Habit not found');
      }
      return { habit: updatedHabit };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to update habit');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.habitsService.remove(id);
      if (!deleted) {
        throw new NotFoundException('Habit not found');
      }
      return { message: `Habit ${id} was deleted.` };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete habit');
    }
  }
}
