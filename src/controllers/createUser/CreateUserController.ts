
import { Request, Response } from "express";
import { container } from "@shared/IoC";
import { CreateUserUseCase } from "./CreateUserUseCase";


export class CreateUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { name, email, password } = request.body;

    const createUserUseCase = container.get(CreateUserUseCase);

    await createUserUseCase.execute({email, name, password});

    return response.status(201).send();

  }
}