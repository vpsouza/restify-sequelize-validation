Sequelize Model Validations Middleware for Restify
=========

A small library for multi-tenancy resify applications that applies Sequelize Model Validation upon request bodies based on a given Sequelize Model name.

## Installation

  `npm install restify-sequelize-validation`

## Usage

```
const validating = require('restify-sequelize-validation');
server.post(<endpoint>, validating(<restifyServerInstance>, <modelName>, <multiTenantModelsInstance), <yourOwnMethodToProcess>);
```

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code!