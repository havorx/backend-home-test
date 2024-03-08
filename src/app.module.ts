import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HousesModule } from './houses/houses.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [HousesModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, TasksService],
})
export class AppModule {}
