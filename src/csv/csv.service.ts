import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { ReadStream, createReadStream } from 'fs';

@Injectable()
export class CsvService {
  public convertCSVBufferToParserStream(
    fileStream: ReadStream,
    skipHeaders: boolean = true,
  ) {
    // init csv parser with skipping headers option
    const csvParser = parse({ from_line: skipHeaders ? 2 : 0 });
    fileStream.pipe(csvParser);

    return csvParser;
  }

  public createFileReadStream(csvFile: Express.Multer.File) {
    const fileReadStream = createReadStream(csvFile.path);

    // handle error when csv parser fails
    fileReadStream.on('error', (err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });

    return fileReadStream;
  }
}
