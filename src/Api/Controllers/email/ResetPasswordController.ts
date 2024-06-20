import { Request, Response } from 'express';

import { ResetPasswordUseCase } from '@Applications/UseCases/users/ResetPasswordUseCase';
import { container } from '@IoC/index';


export class ResetPasswordController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { email } = request.params;

    const resetPasswordUseCase = container.get(ResetPasswordUseCase);

    await resetPasswordUseCase.execute(email);

    return response.status(200).send();
  }
}
