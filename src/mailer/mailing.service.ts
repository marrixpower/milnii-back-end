import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { SendMail } from './dto/send-mail.dto';

@Injectable()
export class MailingService {
  private readonly logger = new Logger('MailingService');

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendMail({ to, subject, template, context }: SendMail) {
    try {
      console.log(
        await this.mailerService.sendMail({
          from: this.configService.get('SMTP_USER'),
          to,
          subject,
          template,
          context,
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}

