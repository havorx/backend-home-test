import { Injectable } from '@nestjs/common';

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
}
