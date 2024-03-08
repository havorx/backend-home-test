import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UPLOAD_CSV_DEST } from 'src/constants';

@Module({
  imports: [
    MulterModule.register({
      dest: UPLOAD_CSV_DEST,
    }),
  ],
  controllers: [HousesController],
  providers: [HousesService],
})
export class HousesModule {}
