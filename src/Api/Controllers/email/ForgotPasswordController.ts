import { Request, Response } from 'express';

import { ForgotPasswordUseCase } from '@Applications/UseCases/users/ForgotPasswordUseCase';
import { container } from '@IoC/index';


export class ForgotPasswordController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { email } = request.params;

    const forgotPasswordUseCase = container.get(ForgotPasswordUseCase);

    await forgotPasswordUseCase.execute(email);

    return response.status(200).send();
  }
}
