import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import { UPLOAD_CSV_DEST } from 'src/constants';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  deleteProcessedCsvFileCron() {
    fs.readdirSync(UPLOAD_CSV_DEST).forEach((file) => {
      this.logger.log('delele csv file is running');
      const filePath = `${UPLOAD_CSV_DEST}/${file}`;

      // time can be longer, 10 seconds is for the sake of testing the cronjob instantly
      const isOlder =
        fs.statSync(filePath).ctime.getTime() < Date.now() - 10000;

      if (isOlder) {
        fs.unlinkSync(filePath);
      }
    });
  }
}
