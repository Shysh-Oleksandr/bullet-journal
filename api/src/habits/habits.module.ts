import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { Habit, HabitSchema } from './habit.model';
import { HabitLog, HabitLogSchema } from './habit-log.model';
import { HabitLogsService } from './habit-logs.service';
import { HabitLogsController } from './habit-logs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Habit.name, schema: HabitSchema },
      { name: HabitLog.name, schema: HabitLogSchema },
    ]),
  ],
  controllers: [HabitsController, HabitLogsController],
  providers: [HabitsService, HabitLogsService],
  exports: [HabitsService, HabitLogsService],
})
export class HabitsModule {}
