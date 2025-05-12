const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');

function loadSwaggerDocs() {
  const docFolder = path.join(__dirname, '..', 'docs');
  const files = fs.readdirSync(docFolder).filter(file => file.endsWith('.yaml'));

  const combinedPaths = {};

  files.forEach(file => {
    const doc = YAML.load(path.join(docFolder, file));
    if (doc.paths) {
      Object.assign(combinedPaths, doc.paths);
    }
  });

  return {
    openapi: '3.0.0',
    info: {
      title: 'API Plataforma Gift Card',
      version: '1.0.0',
      description: 'Documentação da API por módulos'
    },
    servers: [
      { url: 'http://localhost:3001' }
    ],
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
      { bearerAuth: [] }
    ],
    paths: combinedPaths
  };
}

module.exports = (app) => {
  const swaggerSpec = loadSwaggerDocs();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
