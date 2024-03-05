import { Test, TestingModule } from '@nestjs/testing';
import { HousePairs, HousesService } from './houses.service';

describe('HousesService', () => {
  let service: HousesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HousesService],
    }).compile();

    service = module.get<HousesService>(HousesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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

    const actualOutput = service.countUniqueHousePairs(input);
    expect(actualOutput).toEqual(expectedOutput);
  });
});
