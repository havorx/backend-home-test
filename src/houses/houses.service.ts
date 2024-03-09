import { Injectable } from '@nestjs/common';
import { MAXIMUM_ROWS_PER_BATCH } from 'src/constants';
import { CsvService } from 'src/csv/csv.service';
import { finished } from 'stream/promises';

export type HousePairs = [string, string];

@Injectable()
export class HousesService {
  constructor(private readonly csvService: CsvService) {}

  /**
   * @param {HousePairs[]} pairs - the input array
   * @param prevPair - optional param to assign the last pair of the previous chunk
   * after the first chunk
   * @returns {number}  the current count of a chunk
   *
   * The function works with the assumption that the csv files is sorted by the ids
   * which is usual as it can be from a database sorted query
   *
   * Time complexity is O(n)
   */
  public countUniqueHouseAddress(
    pairs: HousePairs[],
    prevPair?: HousePairs,
  ): number {
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

  /**
   * @param csvFile - the input csv file from the request controller
   * @returns {Promise<number>} return the total count of the csv file after every chunks have been processed
   *
   * create the csv file stream and csv parser, then pipe the file stream to the parser
   * each time the parser parses and emit a row, append it to the temp array for chunk accumulation
   *
   * when the array hit the chunk size limit, process the array and reset it to release the memory
   * this will avoid having too much items, causing the node instance to be out of memory
   */
  public async countUniqueHouseAddressFromFile(
    csvFile: Express.Multer.File,
  ): Promise<number> {
    const fileBufferStream = this.csvService.createFileReadStream(csvFile);
    const csvParser =
      this.csvService.convertCSVBufferToParserStream(fileBufferStream);

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
