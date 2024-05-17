import { CreateUserUseCase } from "@Applications/UseCases/users/CreateUserUseCase";
import { Request, Response } from "express";
import { container } from "IoC";

export class CreateUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { name, email, password } = request.body;
    console.log(request.file);
    const { path } = request.file;

    const createUserUseCase = container.get(CreateUserUseCase);
    const avatar = path;
    await createUserUseCase.execute({email, name, password, avatar});

    return response.status(201).send();
  }
}