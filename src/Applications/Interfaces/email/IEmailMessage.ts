export interface IEmailMessage {
  email: string;
  name: string;
  token: string;
  method?: 'Forgot Password' | undefined;
}
