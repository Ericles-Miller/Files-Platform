import { Request, Response } from "express";
import { container } from "@shared/IoC";
import { ListUsersUseCase } from "./ListUserUseCase";



export class ListUserController {
  async handle(request: Request, response: Response) : Promise<Response> {
    const listUsersUseCase = container.get(ListUsersUseCase);

    const users = await listUsersUseCase.execute();
    return response.json(users);
  }
}