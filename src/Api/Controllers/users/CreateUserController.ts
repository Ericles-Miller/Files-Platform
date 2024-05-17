import { CreateUserUseCase } from "@Applications/UseCases/users/CreateUserUseCase";
import { Request, Response } from "express";
import { container } from "IoC";

export class CreateUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const { name, email, password } = request.body;
    const { path } = request.file;

  
    const createUserUseCase = container.get(CreateUserUseCase);
    const avatar = path;
    await createUserUseCase.execute({email, name, password, avatar});

    return response.status(201).send();
  }
}


BUCKET_NAME=files-platform-web-api
BUCKET_REGION=us-east-2
ACCESS_KEY=AKIAW3MD7D4O7HAFIUCV
SECRET_KEY=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
