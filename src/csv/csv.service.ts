import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { ReadStream, createReadStream } from 'fs';

/**
 * dedicated csv handling service to be reused as a deppendency
 */
@Injectable()
export class CsvService {
  /**
   * @param {ReadStream} fileStream - takes in a ReadStream from a file, and pipe it to the csv parser created inside
   *
   * @param {boolean} [skipHeaders=true] - takes in a boolean flag for skipping headers
   * default to true
   */
  public convertCSVBufferToParserStream(
    fileStream: ReadStream,
    skipHeaders: boolean = true,
  ) {
    // init csv parser with skipping headers option
    const csvParser = parse({ from_line: skipHeaders ? 2 : 0 });
    fileStream.pipe(csvParser);

    return csvParser;
  }

  /**
   * wrapper function for create a asynchronous non-blocking file stream
   * @param {Express.Multer.File} file - takes in a file
   * @returns {ReadStream} return a node ReadStream
   */
  public createFileReadStream(file: Express.Multer.File): ReadStream {
    const fileReadStream = createReadStream(file.path);

    // handle error when csv parser fails
    fileReadStream.on('error', (err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });

    return fileReadStream;
  }
}
