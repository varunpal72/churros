'use strict';

const cloud = require('core/cloud');
const common = require('./assets/common');
const expect = require('chakram').expect;
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

  it('should not allow adding a config to a formula with the same key as an already existing config', () => {
    const config = { name: 'Bob the builder', key: 'yes.he.can', type: 'value' };
    const validator = (r) => expect(r).to.have.statusCode(409);

    let formulaId;
    return cloud.post(test.api, common.genFormula({}))
      .then(r => formulaId = r.body.id)
      .then(r => cloud.post(`${test.api}/${formulaId}/configuration`, config))
      .then(r => cloud.post(`${test.api}/${formulaId}/configuration`, config, validator))
      .then(r => cloud.delete(`${test.api}/${formulaId}`));
  });
});
