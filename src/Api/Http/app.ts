/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import 'express-async-errors';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import swaggerUi from 'swagger-ui-express';

import { AppError } from '@Domain/Exceptions/AppError';

import swaggerFile from '../../../swagger.json';
import { router } from './router';


export const app = express();

const certPath = path.resolve(__dirname, '../Http/SSL/code.crt');
const keyPath = path.resolve(__dirname, '../Http/SSL/code.key');

const options: https.ServerOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};


app.use(express.json());
app.use(cors());
app.use(router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));


https.createServer(options, app).listen(3334, () => 'Server is running in https');

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    });
  },
);
