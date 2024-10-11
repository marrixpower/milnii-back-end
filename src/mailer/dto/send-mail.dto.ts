import { Address } from 'nodemailer/lib/mailer';

import { MailTemplateEnum } from '../enum/template-enum';

export type SendMail = {
  to: string | Address | Array<string | Address>;
  subject: string;
} & {
  template: MailTemplateEnum;
  context: any;
};

