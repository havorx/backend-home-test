import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { HousesService } from './houses.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CSV_FILE_SIZE_LIMIT,
  ERROR_TYPE,
  UPLOAD_CSV_DEST,
} from 'src/constants';
import { diskStorage } from 'multer';
import { createUniqueFileName } from 'src/utils';

@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) { }

  @Post('csv-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_CSV_DEST,
        filename(_, file, callback) {
          callback(null, createUniqueFileName(file.originalname));
        },
      }),
    }),
  )
  async uploadCSVFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: CSV_FILE_SIZE_LIMIT }),
          new FileTypeValidator({ fileType: 'text/csv' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const result =
        await this.housesService.countUniqueHouseAddressFromFile(file);

      return {
        data: { uniqueAddressCount: result },
        message: null,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          errorType: ERROR_TYPE.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
