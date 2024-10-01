import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Files Platform Cloud',
      version: '1.0.0',
      description: 'Platform to send files in cloud',
      contact: {
        email: 'ericlesmiller15@gmail.com',
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '../Http/router/**/*.js' : '../Http/router/**/*.ts'),
  ],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
