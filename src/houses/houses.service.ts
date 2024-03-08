import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { ReadStream, createReadStream } from 'fs';
import { MESSAGE } from 'src/constants';
import { Readable } from 'stream';

export type HousePairs = [string, string];

@Injectable()
export class HousesService {
  public countUniqueHouseAddress(pairs: HousePairs[]): number {
    let count = 0;
    let prevPair = null;

    for (let i = 0; i < pairs.length; ++i) {
      if (i === 0) {
        prevPair = pairs[i];
        ++count;
        continue;
      }

      const [prevId, prevAddress] = prevPair;
      const [currentId, currentAddress] = pairs[i];

      if (prevId !== currentId) {
        if (prevAddress !== currentAddress) {
          ++count;
        }
      }

      prevPair = pairs[i];
    }

    return count;
  }

  public convertCSVBufferToStream(fileStream: ReadStream) {
    const records: HousePairs[] = [];

    // init csv parser with skipping headers option
    const csvParser = parse({ from_line: 2 });

    // follow the csv parser docs
    csvParser.on('readable', () => {
      let record: HousePairs;

      while ((record = csvParser.read()) !== null) {
        records.push(record);
      }
    });

    // handle error when csv parser fails
    csvParser.on('error', (err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });

    fileStream.pipe(csvParser);

    // end the csvParser write stream when the file data stream is ended
    fileStream.on('end', () => {
      csvParser.end();
    });

    return { csvParser, records };
  }

  public async countUniqueHouseAddressFromFile(csvFile: Express.Multer.File) {
    const fileBufferStream = createReadStream(csvFile.path);

    const { csvParser, records } =
      this.convertCSVBufferToStream(fileBufferStream);

    return new Promise((resolve, reject) => {
      csvParser.on('end', () => {
        const count = this.countUniqueHouseAddress(records);
        resolve(count);
      });

      csvParser.on('error', () => {
        reject({ message: MESSAGE.FILE_STREAMING_FAILED });
      });
    });
  }
}
