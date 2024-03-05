import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { HousesService } from './houses.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Post('csv-upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadCSVFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { status: 'success', data: null, message: null };
  }
}
