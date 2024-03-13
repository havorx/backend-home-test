import { Test, TestingModule } from '@nestjs/testing';
import { HousePairs, HousesService } from './houses.service';
import { CsvService } from 'src/csv/csv.service';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { ReadStream } from 'fs';

describe('HousesService', () => {
  let service: HousesService;
  let csvService: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HousesService, CsvService],
    }).compile();

    service = module.get<HousesService>(HousesService);
    csvService = module.get<CsvService>(CsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('countUniqueHouseAddress', () => {
    it('should return unique house pair counts', () => {
      const input: HousePairs[] = [
        ['1', '1 Main St.'],
        ['1', '1 Main Street'],
        ['2', '1 Main Street'],
        ['2', '1 Main Street West'],
        ['3', '2 Fith Ave'],
        ['4', '3 Wall Street'],
      ];
      const expectedOutput = 3;

      const actualOutput = service.countUniqueHouseAddress(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should return 1 when all row ids are duplicated', () => {
      const input: HousePairs[] = [
        ['1', '1 Main St.'],
        ['1', '1 Main Street'],
        ['1', '1 Main Street'],
        ['1', '1 Main Street West'],
        ['1', '2 Fith Ave'],
        ['1', '3 Wall Street'],
      ];
      const expectedOutput = 1;

      const actualOutput = service.countUniqueHouseAddress(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should return 1 when all row addresses are duplicated', () => {
      const input: HousePairs[] = [
        ['1', '1 Main St.'],
        ['1', '1 Main St.'],
        ['1', '1 Main St.'],
        ['1', '1 Main St.'],
        ['1', '1 Main St.'],
        ['1', '1 Main St.'],
      ];
      const expectedOutput = 1;

      const actualOutput = service.countUniqueHouseAddress(input);
      expect(actualOutput).toEqual(expectedOutput);
    });

    it('should return 0 when the input is empty', () => {
      const input: HousePairs[] = [];
      const expectedOutput = 0;

      const actualOutput = service.countUniqueHouseAddress(input);
      expect(actualOutput).toEqual(expectedOutput);
    });
  });

  describe('countUniqueHouseAddressFromFile', () => {
    it('should return number of unique house addresses', async () => {
      const input: HousePairs[] = [
        ['1', '1 Main St.'],
        ['1', '1 Main Street'],
        ['2', '1 Main Street'],
        ['2', '1 Main Street West'],
        ['3', '2 Fith Ave'],
        ['4', '3 Wall Street'],
      ];

      // Convert input array to CSV format
      const csvString = input.map((row) => row.join(',')).join('\n');

      const csvFileMock = {
        path: 'test',
        fieldname: 'csvFile',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        buffer: Buffer.from(csvString),
      } as Express.Multer.File;

      // Create a mock readable stream from the buffer
      const readableStream = new Readable() as ReadStream;
      readableStream.push(csvFileMock.buffer);
      readableStream.push(null); // Signal end of stream

      jest
        .spyOn(csvService, 'createFileReadStream')
        .mockReturnValue(readableStream);

      const parser = parse();
      jest
        .spyOn(csvService, 'convertCSVBufferToParserStream')
        .mockReturnValue(parser);

      readableStream.pipe(parser);

      // Call the method being tested
      const result = await service.countUniqueHouseAddressFromFile(csvFileMock);

      // Wait for parsing and the 'end' event to complete
      expect(result).toEqual(3);
    });

    it('should return number of unique house addresses when the input is larger than the batch size limit', async () => {
      const input: HousePairs[] = [
        ['1', '1 Main St.'],
        ['1', '1 Main Street'],
        ['2', '1 Main Street'],
        ['2', '1 Main Street West'],
        ['3', '2 Fith Ave'],
        ['4', '3 Wall Street'],
      ];

      let counter = 0;
      while (counter < 50) {
        input.push(
          ['1', '1 Main St.'],
          ['1', '1 Main Street'],
          ['2', '1 Main Street'],
          ['2', '1 Main Street West'],
          ['3', '2 Fith Ave'],
          ['4', '3 Wall Street'],
        );
        ++counter;
      }

      input.sort((a, b) => Number(a[0]) - Number(b[0]));

      // Convert input array to CSV format
      const csvString = input.map((row) => row.join(',')).join('\n');

      const csvFileMock = {
        path: 'test',
        fieldname: 'csvFile',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        buffer: Buffer.from(csvString),
      } as Express.Multer.File;

      // Create a mock readable stream from the buffer
      const readableStream = new Readable() as ReadStream;
      readableStream.push(csvFileMock.buffer);
      readableStream.push(null); // Signal end of stream

      jest
        .spyOn(csvService, 'createFileReadStream')
        .mockReturnValue(readableStream);

      const parser = parse();
      jest
        .spyOn(csvService, 'convertCSVBufferToParserStream')
        .mockReturnValue(parser);

      readableStream.pipe(parser);

      // Call the method being tested
      const result = await service.countUniqueHouseAddressFromFile(csvFileMock);

      // Wait for parsing and the 'end' event to complete
      expect(result).toEqual(3);
    });
  });
});
