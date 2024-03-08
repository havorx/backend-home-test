export const enum MESSAGE {
  FILE_STREAMING_FAILED = 'file streaming is failed',
}

export const enum ERROR_TYPE {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export const UPLOAD_CSV_DEST = '/tmp/upload/csv-files';

// just for the concept idea, the number can be higher in a thoroughly benchmarked solution
export const MAXIMUM_ROWS_PER_BATCH = 200;
