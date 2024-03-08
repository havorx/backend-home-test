import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { ReadStream, createReadStream } from 'fs';
import { MAXIMUM_ROWS_PER_BATCH, MESSAGE } from 'src/constants';
import { finished } from 'stream/promises';

export type HousePairs = [string, string];

@Injectable()
export class HousesService {
  private countUniqueHouseAddress(pairs: HousePairs[], prevPair?: HousePairs) {
    const pairsLength = pairs.length;

    let currentCount = 0;

    for (let i = 0; i < pairsLength; ++i) {
      // when the first csv batch is processed
      // increase the initial count by 1 and assign the prevPair as the first row of the file
      if (i === 0 && !prevPair) {
        prevPair = pairs[i];
        ++currentCount;
        continue;
      }

      if (prevPair) {
        const [prevId, prevAddress] = prevPair;
        const [currentId, currentAddress] = pairs[i];

        if (prevId !== currentId) {
          if (prevAddress !== currentAddress) {
            ++currentCount;
          }
        }

        prevPair = pairs[i];
      }
    }

    return currentCount;
  }

  private convertCSVBufferToStream(fileStream: ReadStream) {
    // init csv parser with skipping headers option
    const csvParser = parse({ from_line: 2 });
    fileStream.pipe(csvParser);

    return csvParser;
  }

  public async countUniqueHouseAddressFromFile(csvFile: Express.Multer.File) {
    const fileBufferStream = createReadStream(csvFile.path);

    // handle error when csv parser fails
    fileBufferStream.on('error', (err) => {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    });

    const csvParser = this.convertCSVBufferToStream(fileBufferStream);

    let totalCount = 0;
    let prevPair: HousePairs | undefined = undefined;

    let records: HousePairs[] = [];

    // push into the array input each time the parser emit a parsed chunk
    csvParser.on('data', (data) => {
      records.push(data);

      // when parser parses enough data per batch, process the batch
      if (records.length === MAXIMUM_ROWS_PER_BATCH) {
        const currentCount = this.countUniqueHouseAddress(records, prevPair);
        totalCount += currentCount;

        // last pair of the current batch to be used in the next batch
        prevPair = records[records.length - 1];

        // reset the array input to prepare for the next batch
        records = [];
      }
    });

    await finished(csvParser);
    // process remaining parsed rows pushed to records when the parser ends the parsing
    if (records.length > 0) {
      const currentCount = this.countUniqueHouseAddress(records, prevPair);
      totalCount += currentCount;
    }

    return totalCount;
  }
}
