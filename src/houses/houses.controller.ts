import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HousesService } from './houses.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Post('csv-upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSVFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.housesService.countUniqueHouseAddressFromFile(
        file.buffer,
      );

      return {
        data: { uniqueAddressCount: result },
        message: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
