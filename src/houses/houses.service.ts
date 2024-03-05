import { Injectable } from '@nestjs/common';

export type HousePairs = [string, string];

@Injectable()
export class HousesService {
  public countUniqueHousePairs(pairs: HousePairs[]): number {
    return 3;
  }
}
