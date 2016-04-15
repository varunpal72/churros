'use strict';

const common = require('./assets/common');
const invalid = require('./assets/formula-with-invalid-configs');
const suite = require('core/suite');
const schema = require('./assets/schemas/formula.schema');

suite.forPlatform('formulas', { name: 'formula config', schema: schema }, (test) => {
  before(() => common.deleteFormulasByName('formulas', invalid.name));

  /* make sure config keys are being validated properly when creating a formula with config */
  test
    .withName('should not allow creating a formula with two configs that have the same key')
    .withJson(invalid)
    .should.return409OnPost();
});
