const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/auth.yaml'));
const giftcards = YAML.load(path.join(__dirname, '../docs/giftcards.yaml'));
const wallet = YAML.load(path.join(__dirname, '../docs/wallet.yaml'));
const investments = YAML.load(path.join(__dirname, '../docs/investments.yaml'));
const offers = YAML.load(path.join(__dirname, '../docs/offers.yaml'));
const admin = YAML.load(path.join(__dirname, '../docs/admin.yaml'));

// Merge manual (alternativa ao swagger-jsdoc)
const swaggerMerged = {
  openapi: '3.0.0',
  info: {
    title: 'Urbana Gift Card API',
    version: '1.0.0',
    description: 'Documentação da API organizada por módulos'
  },
  paths: {
    ...swaggerDocument.paths,
    ...giftcards.paths,
    ...wallet.paths,
    ...investments.paths,
    ...offers.paths,
    ...admin.paths
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
  security: [{ bearerAuth: [] }]
};

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerMerged));

module.exports = router;
