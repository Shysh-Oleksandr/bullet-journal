import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HabitLogsService } from './habit-logs.service';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitLogDto } from './dto/update-habit-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('habit-logs')
@UseGuards(JwtAuthGuard)
export class HabitLogsController {
  constructor(private readonly habitLogsService: HabitLogsService) {}

  @Post()
  async create(@Body() createHabitLogDto: CreateHabitLogDto) {
    try {
      const habitLog = await this.habitLogsService.create(createHabitLogDto);
      return { habitLog };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to create habit log');
    }
  }

  @Get('habit/:habitId')
  async findAllForHabit(@Param('habitId') habitId: string) {
    try {
      const habitLogs = await this.habitLogsService.findAll(habitId);
      return habitLogs;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch habit logs');
    }
  }

  @Get('habit/:habitId/range')
  async findByDateRange(
    @Param('habitId') habitId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const startDateNum = parseInt(startDate, 10);
      const endDateNum = parseInt(endDate, 10);

      if (isNaN(startDateNum) || isNaN(endDateNum)) {
        throw new BadRequestException('Invalid date parameters');
      }

      const habitLogs = await this.habitLogsService.findByDateRange(
        habitId,
        startDateNum,
        endDateNum,
      );

      return habitLogs;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch habit logs by date range');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const habitLog = await this.habitLogsService.findOne(id);
      if (!habitLog) {
        throw new NotFoundException('Habit log not found');
      }
      return { habitLog };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch habit log');
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHabitLogDto: UpdateHabitLogDto,
  ) {
    try {
      const updatedHabitLog = await this.habitLogsService.update(
        id,
        updateHabitLogDto,
      );
      if (!updatedHabitLog) {
        throw new NotFoundException('Habit log not found');
      }
      return { habitLog: updatedHabitLog };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to update habit log');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.habitLogsService.remove(id);
      if (!deleted) {
        throw new NotFoundException('Habit log not found');
      }
      return { message: `Habit log ${id} was deleted.` };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to delete habit log');
    }
  }
}
