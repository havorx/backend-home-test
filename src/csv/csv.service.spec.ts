import { Test, TestingModule } from '@nestjs/testing';
import { CsvService } from './csv.service';
import { ReadStream } from 'fs';
import { Parser, parse } from 'csv-parse';
import { Readable } from 'stream';

jest.mock('csv-parse');

describe('CsvService', () => {
  let service: CsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvService],
    }).compile();

    service = module.get<CsvService>(CsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertCSVBufferToParserStream', () => {
    it('should return csv parser from file stream', () => {
      const fileStreamMock = new Readable() as ReadStream;

      (parse as jest.Mock).mockImplementation(() => {
        return new Parser({ from_line: 2 });
      });

      jest.spyOn(fileStreamMock, 'pipe').mockImplementation(jest.fn());

      const result = service.convertCSVBufferToParserStream(
        fileStreamMock,
        true,
      );

      expect(result).toBeInstanceOf(Parser);
    });
  });

  describe('createFileReadStream', () => {
    jest.mock('fs', () => ({
      ...jest.requireActual('fs'),
      createReadStream: jest.fn().mockImplementation(() => {
        return new ReadStream();
      }),
    }));

    it('should return file read stream', () => {
      const csvFileMock = {
        path: 'test',
        fieldname: 'csvFile',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
      } as Express.Multer.File;

      const result = service.createFileReadStream(csvFileMock);

      expect(result).toBeInstanceOf(ReadStream);
    });
  });
});
