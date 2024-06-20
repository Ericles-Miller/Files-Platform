export interface IEmailMessage {
  email: string;
  name: string;
  token: string;
  method?: 'Reset Password' | undefined;
}
