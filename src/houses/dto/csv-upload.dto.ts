import { ApiProperty } from '@nestjs/swagger';

export class CSVUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Buffer;
}

export class CSVUploadResponse {
  @ApiProperty({
    type: 'object',
    properties: { uniqueAddressCount: { type: 'number' } },
  })
  data: {
    uniqueAddressCount: number;
  };
}
