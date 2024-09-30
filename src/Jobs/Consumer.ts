import amqp from 'amqplib';

import { IEmailMessage } from '@Applications/Interfaces/email/IEmailMessage';
import { resetPasswordByEmail } from '@Applications/Services/email/resetPasswordByEmail';
import { sendEmailConfirmAccount } from '@Applications/Services/email/sendEmailConfirmAccount';

export async function receiveMessages(): Promise<void> {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'emailQueue';

    await channel.assertQueue(queue, { durable: true });
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const {
          email, name, token, method,
        } = JSON.parse(msg.content.toString()) as IEmailMessage;

        console.log(' [x] Received \'%s\'', email);

        if (method !== 'Forgot Password') {
          await sendEmailConfirmAccount(email, name, token);
          channel.ack(msg);
        } else {
          resetPasswordByEmail({ email, name, token });
          channel.ack(msg);
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
