import { ListUsersUseCase } from "@Applications/UseCases/users/ListUserUseCase";
import { Request, Response } from "express";
import { container } from "IoC";

export class ListUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const listUsersUseCase = container.get(ListUsersUseCase);

    const users = await listUsersUseCase.execute();
    return response.json(users);
  }
}