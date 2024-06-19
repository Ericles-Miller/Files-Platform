import { EmailOptions } from '@Domain/Entities/EmailOptions';
import { AppError } from '@Domain/Exceptions/AppError';
import { Mailer } from '@Jobs/Mailer';

export async function sendEmail(email: string, name: string, token: string) : Promise<void> {
  const url = `localhost:${process.env.PORT}/sessions/accountsConfirm/${token}`;
  const subject = ' Confirm your account on All Safe Cloud';
  const from = process.env.EMAIL_LOGIN;
  const to = email;
  const text = `Hii ${name},

    Welcome to All Safe Cloud Platform!

    To complete your account creation and start taking advantage of all our features, you need to confirm your email address.

    How to confirm your email:

    Click on the following link: ${url}
    Follow the on-screen instructions to complete the scan.
    Why is it important to confirm your email?

    Confirming your email ensures that you can receive important notifications from the platform, such as file sharing warnings, 
    link expiration reminders, and security updates.
    It also helps protect your account from unauthorized access.
    What can you do on All Safe Cloud?

    Store your files securely in the cloud.
    Share files with friends, family and co-workers.
    Access your files from anywhere, at any time.
    Collaborate on documents with others in real time.
    Automatically back up your files to prevent data loss.
    We look forward to you being part of our community!

    Yours sincerely,

    All Safe Cloud Team
  `;

  if (!from) {
    throw new AppError('The variable from present in .env is null', 404);
  }

  const emailOptions = new EmailOptions(to, subject, text, from);

  const mailer = new Mailer();

  const transporter = await mailer.execute();

  (await transporter).sendMail(emailOptions, (err, data) => { // verificar se posso remover o data
    if (err) {
      console.log(`Error ${err}`);
    } else {
      console.log('Email sent successfully');
    }
  });
}
