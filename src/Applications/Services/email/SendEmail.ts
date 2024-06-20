import { EmailOptions } from '@Domain/Entities/EmailOptions';
import { AppError } from '@Domain/Exceptions/AppError';
import { Mailer } from '@Jobs/Mailer';

export async function sendEmail(email: string, name: string, token: string) : Promise<void> {
  const url = `${process.env.PATH_CONFIRM_TOKEN}${token}`;
  console.log(url);

  const subject = ' Confirm your account on All Safe Cloud';
  const from = process.env.EMAIL_LOGIN;
  const to = email;
  const html = ` <p>Hi ${name},</p>
    <p>Welcome to All Safe Cloud Platform!</p>
    <p>To complete your account creation and start taking advantage of all our features, you need to confirm your email address.</p>
    <p>How to confirm your email:</p>
    <p>Click on the following link: <a href="http://localhost:3000/sessions/recover/">Confirm Email</a></p>
    <p>Follow the on-screen instructions to complete the scan.</p>
    <p>Why is it important to confirm your email?</p>
    <p>Confirming your email ensures that you can receive important notifications from the platform, such as file sharing warnings, 
    link expiration reminders, and security updates. It also helps protect your account from unauthorized access.</p>
    <p>What can you do on All Safe Cloud?</p>
    <ul>
      <li>Store your files securely in the cloud.</li>
      <li>Share files with friends, family and co-workers.</li>
      <li>Access your files from anywhere, at any time.</li>
      <li>Collaborate on documents with others in real time.</li>
      <li>Automatically back up your files to prevent data loss.</li>
    </ul>
    <p>We look forward to you being part of our community!</p>
    <p>Yours sincerely,</p>
    <p>All Safe Cloud Team</p>
  `;

  if (!from) {
    throw new AppError('The variable from present in .env is null', 404);
  }

  const emailOptions = new EmailOptions(to, subject, html, from);

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
