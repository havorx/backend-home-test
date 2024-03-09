import { Test, TestingModule } from '@nestjs/testing';
import { HousePairs, HousesService } from './houses.service';
import { CsvService } from 'src/csv/csv.service';

describe('HousesService', () => {
  let service: HousesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HousesService, CsvService],
    }).compile();

    service = module.get<HousesService>(HousesService);
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
});
