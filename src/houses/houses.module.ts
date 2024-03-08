import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UPLOAD_CSV_DEST } from 'src/constants';
import { CsvService } from 'src/csv/csv.service';

@Module({
  imports: [
    MulterModule.register({
      dest: UPLOAD_CSV_DEST,
    }),
  ],
  controllers: [HousesController],
  providers: [HousesService, CsvService],
})
export class HousesModule {}
