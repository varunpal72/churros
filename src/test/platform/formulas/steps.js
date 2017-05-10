'use strict';

const cleaner = require('core/cleaner');
const cloud = require('core/cloud');
const common = require('./assets/common');
const expect = require('chakram').expect;
const invalidJson = require('./assets/formulas/formula-with-invalid-step-properties');
const invalidStatusCodeJson = require('./assets/formulas/formula-with-invalid-status-code-properties');
const validStatusCodeJson = require('./assets/formulas/formula-with-valid-status-code-properties');
const suite = require('core/suite');
const schema = require('./assets/schemas/formula.schema');

suite.forPlatform('formulas', { name: 'formula steps', schema: schema }, (test) => {
  before(() => cleaner.formulas.withName(invalidJson.name));

  /* make sure step properties are being validated properly when creating a formula with steps*/
  test
    .withName('should not allow creating a formula with a step that has an invalid retryAttempts property')
    .withJson(invalidJson)
    .should.return400OnPost();

  test
    .withName('should not allow creating a formula with a step that has an invalid retryStatusCodes property')
    .withJson(invalidStatusCodeJson)
    .should.return400OnPost();

  it('should allow creating a formula with a step that has an valid retryStatusCodes property', () => {
    let validFormulaId;
    return cloud.post(test.api, validStatusCodeJson)
      .then(r => validFormulaId = r.body.id)
      .then(r => cloud.delete(`formulas/${validFormulaId}`));
  });

  /* make sure step properties are being validated properly when adding a step to an existing formula */
  it('should not allow adding a step to a formula that has an invalid retryAttempts property', () => {
    const validator = (r) => {
      expect(r).to.have.statusCode(400);
      expect(r.body.message).to.contain('retryAttempts');
      return r;
    };

    let formulaId;
    return cloud.post(test.api, common.genFormula({}))
      .then(r => formulaId = r.body.id)
      .then(r => cloud.post(`${test.api}/${formulaId}/steps`, invalidJson.steps[0], validator))
      .then(r => cloud.delete(`${test.api}/${formulaId}`));
  });
});
