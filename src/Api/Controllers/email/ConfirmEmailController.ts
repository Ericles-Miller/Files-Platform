import { Request, Response } from 'express';

import { ConfirmEmailUseCase } from '@Applications/UseCases/email/ConfirmEmailUseCase';
import { container } from '@IoC/index';


export class ConfirmEmailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.params;

    const confirmEmailUseCase = container.get(ConfirmEmailUseCase);

    await confirmEmailUseCase.execute(token);

    return response.status(200).send();
  }
}
