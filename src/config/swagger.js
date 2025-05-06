const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Urbana Gift Card API',
      version: '1.0.0',
      description: 'Documentação Swagger para a API Urbana Gift Card'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.resolve(__dirname, '../docs/*.yaml')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
