import { UpdateUserUseCase } from "@Applications/UseCases/users/UpdateUserUseCase";
import { Request, Response } from "express";
import { container } from "IoC";

export class UpdateUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const {email, enable, id, name, password} = request.body;
    const file = request.file;

    const updateUserUseCase = container.get(UpdateUserUseCase);

    await updateUserUseCase.execute({id,email, enable, file,name,password});

    return response.status(204).send();
  }
}