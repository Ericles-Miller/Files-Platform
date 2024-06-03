import { sign } from "jsonwebtoken";

export class GenerateTokenProvider {
  async execute(userId: string) : Promise<string> {
    const token = sign({}, "40fe3ccb6f87eb4cf80f3c5dda631e2f", { 
      subject: userId,
      expiresIn: "5m",
    });

    return token;
  }
}