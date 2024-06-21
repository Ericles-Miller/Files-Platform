import nodemailer from 'nodemailer';

export async function sendConfirmationEmail(email: string, token: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const url = `${process.env.BASE_URL}/confirm/${token}`;

  await transporter.sendMail({
    from: '"YourApp" <your_email@example.com>',
    to: email,
    subject: 'Confirm your email',
    html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
  });
}
