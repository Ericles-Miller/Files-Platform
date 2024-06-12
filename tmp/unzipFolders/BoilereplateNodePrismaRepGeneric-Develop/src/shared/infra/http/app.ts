import "reflect-metadata";
import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import { AppError } from "@shared/errors/AppError";
import * as path from 'path'; 
import * as fs from 'fs';
import * as https from 'https';

import { router } from "./router";
import cors from "cors";

export const app = express();

const certPath = path.resolve(__dirname, '../../SSL/code.crt'); 
const keyPath = path.resolve(__dirname, '../../SSL/code.key');

const options: https.ServerOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};


app.use(express.json());
app.use(cors())
app.use(router);

https.createServer(options, app).listen(3334, ()=> 'Server is running in https');


app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  },
);
