export class EmailOptions {
  to: string;
  subject: string;
  html: string;
  from: string;

  constructor(to: string, subject: string, html: string, from: string) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.html = html;
  }
}
