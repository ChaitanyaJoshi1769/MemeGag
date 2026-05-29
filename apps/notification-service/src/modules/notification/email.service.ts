import { Injectable } from '@nestjs/common';
import { createLogger } from '@memegag/logger';
import config from '@memegag/config';

const logger = createLogger('EmailService');

@Injectable()
export class EmailService {
  async send(to: string, subject: string, body: string): Promise<boolean> {
    try {
      // In production, integrate with Resend/SendGrid/Mailgun
      // For now, just log
      logger.info({ to, subject }, 'Email would be sent');

      if (config.EMAIL_PROVIDER === 'resend' && config.RESEND_API_KEY) {
        // await this.sendViaResend(to, subject, body);
      } else if (config.EMAIL_PROVIDER === 'sendgrid' && config.SENDGRID_API_KEY) {
        // await this.sendViaSendGrid(to, subject, body);
      }

      return true;
    } catch (error) {
      logger.error({ error, to }, 'Failed to send email');
      return false;
    }
  }
}
