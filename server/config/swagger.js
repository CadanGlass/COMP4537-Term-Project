/**
 * Swagger/OpenAPI Configuration
 * 
 * Resources & Attributions:
 * - ChatGPT: Helped structure the OpenAPI documentation
 * - Swagger Documentation: https://swagger.io/docs/
 * - OpenAPI Specification: https://spec.openapis.org/oas/v3.0.0
 * - Express Swagger UI: https://www.npmjs.com/package/swagger-ui-express
 * 
 * Documentation structure and organization inspired by:
 * - ChatGPT recommendations
 * - REST API best practices
 * - Industry standard API documentation patterns
 */

const path = require('path');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Image to Text API',
    version: '1.0.0',
    description: 'API for converting images to text and managing users',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3003',
      description: 'Development server',
    },
    {
      url: 'https://cadan.xyz',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
    {
      name: 'Users',
      description: 'User management',
    },
    {
      name: 'Admin',
      description: 'Admin only operations',
    },
    {
      name: 'API',
      description: 'API usage tracking',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Unauthorized',
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../server.js'),
    path.join(__dirname, '../models/*.js'),
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../docs/*.yaml')
  ],
};

module.exports = options; 