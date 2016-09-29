'use strict';

const suite = require('core/suite');
const schema = require('./assets/integration.schema');
const pluralSchema = require('./assets/integrations.schema');
const formula = require('./assets/formula');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;
const cleaner = require('core/cleaner');

/* default simple payload */
const payload = { name: 'churros-integration', status: 'development' };

suite.forPlatform('integrations', { schema, payload }, (test) => {
  beforeEach(() => {
    return cleaner.integrations.withName([payload.name, `${payload.name}-update`])
      .then(() => cleaner.formulas.withName(formula.name));
  });

  test
    .withOptions({ churros: { updatePayload: { name: `${payload.name}-update`, status: 'published' } } })
    .should.supportCrud(chakram.put);

  test
    .withName('should not support creating an integration without a name')
    .withJson({ name: null })
    .should.return400OnPost();

  test
    .withValidation(pluralSchema)
    .should.supportNextPagePagination(1, true);

  it('should not support having two integrations with the same name', () => {
    let id;
    return cloud.post('/integrations', payload)
      .then(r => id = r.body.id)
      .then(() => cloud.post('/integrations', payload, (r) => expect(r).to.have.statusCode(409)))
      .then(() => cloud.delete(`/integrations/${id}`));
  });

  it('should support adding and removing a formula and formula instance from an integration', () => {
    let id, formulaId, formulaInstanceId;
    return cloud.post('/formulas', formula)
      .then(r => formulaId = r.body.id)
      .then(r => cloud.post(`/formulas/${formulaId}/instances`, { name: 'tmp' }))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => cloud.post('/integrations', payload))
      .then(r => id = r.body.id)
      .then(() => cloud.post(`/integrations/${id}/formulas/${formulaId}`))
      .then(() => cloud.post(`/integrations/${id}/formulas/instances/${formulaInstanceId}`))
      .then(() => cloud.delete(`/integrations/${id}/formulas/instances/${formulaInstanceId}`))
      .then(() => cloud.delete(`/integrations/${id}/formulas/${formulaId}`))
      .then(() => cloud.delete(`/formulas/${formulaId}/instances/${formulaInstanceId}`))
      .then(() => cloud.delete(`/formulas/${formulaId}`))
      .then(() => cloud.delete(`/integrations/${id}`));
  });
});
