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
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../common/types';
import { ReorderHabitsDto } from './dto/reorder-habits.dto';
import { HabitLog } from './habit-log.model';
import { HabitCalendarQueryDto } from './dto/habit-calendar.dto';
import { HabitSummaryQueryDto } from './dto/habit-summary.dto';

@Controller('habits')
// Disabled as a workaround for the web app TODO: Remove this
// @UseGuards(JwtAuthGuard)
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

  @Get('summary')
  async findAllSummary(
    @Req() req: RequestWithUser,
    @Query() query: HabitSummaryQueryDto,
  ) {
    try {
      const habits = await this.habitsService.findAllSummary(
        query.userId ?? req.user.userId,
        query.startDate,
        query.endDate,
      );

      return habits;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch habits');
    }
  }

  @Get('all')
  async findAll(@Req() req: RequestWithUser) {
    try {
      const habits = await this.habitsService.findAll(req.user.userId);
      return habits;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch all habits');
    }
  }

  @Get('archived')
  async findAllArchived(@Req() req: RequestWithUser) {
    try {
      const habits = await this.habitsService.findAllArchived(req.user.userId);
      return habits;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch archived habits');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const habit = await this.habitsService.findOne(id);
      if (!habit) {
        throw new NotFoundException('Habit not found');
      }
      return habit;
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

  @Post(':id/logs')
  async createOrUpdateLog(
    @Param('id') id: string,
    @Body() logData: Partial<HabitLog>,
    @Query('date') date: string,
  ) {
    try {
      if (!date) {
        throw new BadRequestException('Date is required');
      }
      const log = await this.habitsService.updateHabitLog(id, date, logData);
      return { log };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to update habit log');
    }
  }

  @Delete(':id/logs')
  async deleteLog(@Param('id') id: string, @Query('date') date: string) {
    try {
      if (!date) {
        throw new BadRequestException('Date is required');
      }
      const deleted = await this.habitsService.deleteHabitLog(id, date);
      if (!deleted) {
        throw new NotFoundException('Habit log not found');
      }
      return { message: 'Habit log deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete habit log');
    }
  }

  @Post('update-all-habits-metrics')
  async updateAllHabitsMetrics() {
    await this.habitsService.updateMetricsForAllHabits();
    return { message: 'All habits metrics updated successfully' };
  }

  @Get(':id/calendar')
  async getHabitCalendar(
    @Param('id') id: string,
    @Query() query: HabitCalendarQueryDto,
  ) {
    try {
      console.log('Getting habit calendar data');
      const calendarData = await this.habitsService.getHabitCalendarData(
        id,
        query,
      );
      return calendarData;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch habit calendar data');
    }
  }
}
