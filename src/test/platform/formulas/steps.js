'use strict';

const cleaner = require('core/cleaner');
const cloud = require('core/cloud');
const common = require('./assets/common');
const expect = require('chakram').expect;
const invalidJson = require('./assets/formulas/formula-with-invalid-step-properties');
const suite = require('core/suite');
const schema = require('./assets/schemas/formula.schema');

suite.forPlatform('formulas', { name: 'formula steps', schema: schema }, (test) => {
  before(() => cleaner.formulas.withName(invalidJson.name));

  /* make sure step properties are being validated properly when creating a formula with steps*/
  test
    .withName('should not allow creating a formula with a step that has an invalid retryAttempts property')
    .withJson(invalidJson)
    .should.return400OnPost();

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
