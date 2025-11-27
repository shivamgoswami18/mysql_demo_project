import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();

interface MailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function mailSend({ to, subject, text }: MailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Mysql demo" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
    });
  } catch (err) {
    Logger.error(err);
    throw err;
  }
}
