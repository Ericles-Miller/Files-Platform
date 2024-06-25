import { Request, Response } from 'express';

import { ResetPasswordUseCase } from '@Applications/UseCases/users/ResetPasswordUseCase';
import { container } from '@IoC/index';


export class ResetPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password, confirmPassword } = request.body;

    const resetPasswordUseCase = container.get(ResetPasswordUseCase);

    await resetPasswordUseCase.execute(email, password, confirmPassword);

    return response.status(201).send();
  }

  async getResetPassword(request: Request, response: Response): Promise<Response> {
    const { userId } = request;

    const resetPasswordUseCase = container.get(ResetPasswordUseCase);

    await resetPasswordUseCase.getReset(userId);

    return response.json({ status: true });
  }
}
