import { Injectable } from '@nestjs/common';
import { CreateHouseDto } from './dto/create-house.dto';

@Injectable()
export class HousesService {
  create(createHouseDto: CreateHouseDto) {
    return 'This action adds a new house';
  }
}
