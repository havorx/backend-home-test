import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HousesModule } from './houses/houses.module';

@Module({
  imports: [HousesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
