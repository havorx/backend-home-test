import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
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

  public convertCSVBufferToStream(fileBuffer: Buffer) {
    const records: HousePairs[] = [];

    const csvParser = parse({ from_line: 2 });

    csvParser.on('readable', () => {
      let record: HousePairs;

      while ((record = csvParser.read()) !== null) {
        records.push(record);
      }
    });

    csvParser.on('error', (err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });

    const streamFromFile = Readable.from(fileBuffer);

    streamFromFile.pipe(csvParser);

    streamFromFile.on('end', () => {
      csvParser.end();
    });

    return { csvParser, records };
  }

  public async countUniqueHouseAddressFromFile(fileBuffer: Buffer) {
    const { csvParser, records } = this.convertCSVBufferToStream(fileBuffer);

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
