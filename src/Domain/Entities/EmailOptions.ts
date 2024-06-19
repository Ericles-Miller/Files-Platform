export class EmailOptions {
  to: string;
  subject: string;
  text: string;
  from: string;

  constructor(to: string, subject: string, text: string, from: string) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.text = text;
  }
}
