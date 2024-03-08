export const enum ERROR_TYPE {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export const UPLOAD_CSV_DEST = '/tmp/upload/csv-files';

// just for the concept idea, the number can be higher in a thoroughly benchmarked solution
export const MAXIMUM_ROWS_PER_BATCH = 200;

// just for the idea, it can be different for more specific business requirements
export const CSV_FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB
