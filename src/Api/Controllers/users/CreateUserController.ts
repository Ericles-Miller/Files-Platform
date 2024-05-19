import { CreateUserUseCase } from "@Applications/UseCases/users/CreateUserUseCase";
import { Request, Response } from "express";
import { container } from "IoC";

export class CreateUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { name, email, password } = request.body;
  
    const createUserUseCase = container.get(CreateUserUseCase);
    const file = request.file;
    await createUserUseCase.execute({email, name, password, file});

    return response.status(201).send();
  }
}


