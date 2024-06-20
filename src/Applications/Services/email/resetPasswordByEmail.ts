import { IEmailMessage } from '@Applications/Interfaces/email/IEmailMessage';
import { EmailOptions } from '@Domain/Entities/EmailOptions';
import { AppError } from '@Domain/Exceptions/AppError';
import { Mailer } from '@Jobs/Mailer';

export async function resetPasswordByEmail({ email, name, token } : IEmailMessage) : Promise<void> {
  const url = `${process.env.PATH_RESET_PASSWORD}${token}`;
  const subject = 'Reset your password on All Safe Cloud Platform';
  const from = process.env.EMAIL_LOGIN;
  const to = email;
  const html = `<p>Hello ${name},</p>
    <p>We have received a request to reset your account password on <strong>All Safe Cloud Platform</strong>.</p>
    
    <p>To reset your password:</p>
    <p>Click the following link: <a href="${url}>Reset Password</a></p>
    <p>Follow the on-screen instructions to create a new password.</p>
    
    <p>Why did you receive this email?</p>
    <p>This email was sent because you requested to reset your password. 
    If you have not requested this reset, please ignore this email or contact our support team.</p>
    
    <p>Security of your account:</p>
    <p>The security of your account is important to us.
    We recommend that you use a strong and unique password for your <strong>All Safe Cloud Platform</strong> account.
    You should also change your password regularly.</p>
    
    <p>Thank you for using <strong>All Safe Cloud Platform</strong>!</p>
    
    <p>Sincerely,</p>
    
    <p>Team at <strong>All Safe Cloud Platform</strong></p>`;

  if (!from) {
    throw new AppError('The variable from present in .env is null', 404);
  }

  const emailOptions = new EmailOptions(to, subject, html, from);

  const mailer = new Mailer();

  const transporter = await mailer.execute();

  (await transporter).sendMail(emailOptions, (err) => {
    if (err) {
      console.log(`Error ${err}`);
    } else {
      console.log('Email sent successfully');
    }
  });
}
