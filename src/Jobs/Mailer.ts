import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class Mailer {
  async execute() : Promise<nodemailer.Transporter<SMTPTransport.SentMessageInfo>> {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      process.env.OAUTH_REDIRECT_URI,
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });

    const ACCESS_TOKEN = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
        type: 'OAuth2',
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    return transporter;
  }
}

