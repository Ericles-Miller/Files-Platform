import { UpdateUserUseCase } from "@Applications/UseCases/users/UpdateUserUseCase";
import { container } from "@IoC/index";
import { Request, Response } from "express";

export class UpdateUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { enable, id, name, password } = request.body;
    const file = request.file;

    const updateUserUseCase = container.get(UpdateUserUseCase);

    await updateUserUseCase.execute({id, enable, file, name,password});

    return response.status(204).send();
  }
}