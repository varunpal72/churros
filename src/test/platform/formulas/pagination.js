'use strict';

const cloud = require('core/cloud');
const common = require('./assets/common');
const expect = require('chakram').expect;
const executionSchema = require('./assets/schemas/execution.schema');
const executionsSchema = require('./assets/schemas/executions.schema');
const stepExecutionSchema = require('./assets/schemas/step-execution.schema');
const stepExecutionsSchema = require('./assets/schemas/step-executions.schema');
const stepExecutionValueSchema = require('./assets/schemas/step-execution-value.schema');
const stepExecutionValuesSchema = require('./assets/schemas/step-execution-values.schema');
const suite = require('core/suite');
const tools = require('core/tools');

suite.forPlatform('pagination', { name: 'formula execution pagination' }, (test) => {
  const terminate = (r) => {
    console.log(`Rats...${r}`);
    process.exit(1);
  };

  /** Setup a formula and formula instance and kick off an execution */
  let formulaId, formulaInstanceId, elementInstanceId;
  before(() => {
    const config = { 'event.notification.enabled': true, 'event.vendor.type': 'polling', 'event.poller.refresh_interval': 999999999 };
    return common.createFAndFI('sfdc', config)
      .then(r => {
        formulaId = r.formulaId;
        formulaInstanceId = r.formulaInstanceId;
        elementInstanceId = r.elementInstanceId;
      })
      .then(r => common.generateSfdcEvent(elementInstanceId, require('./assets/single-event-sfdc')))
      .then(r => common.generateSfdcEvent(elementInstanceId, require('./assets/single-event-sfdc')))
      .then(r => tools.sleep(5))
      .catch(r => terminate(r));
  });

  /* Cleanup */
  after(() => common.cleanup(elementInstanceId, formulaId, formulaInstanceId));

  it('should support retrieving a formula instance execution, step executions and step execution values', () => {
    const options = { qs: { pageSize: 1 } };

    const validator = (schema) => (r) => {
      // validate headers
      const headers = r.response.headers;
      expect(headers).to.not.be.null;

      const returnedCount = parseInt(headers['elements-returned-count']);
      const totalCount = parseInt(headers['elements-total-count']);
      expect(returnedCount).to.be.a('number');
      expect(totalCount).to.be.a('number');

      // there should ALWAYS be a next page token if there are more results
      const nextPageToken = headers['elements-next-page-token'];
      if (returnedCount < totalCount) expect(nextPageToken).to.be.a('string');
      else expect(nextPageToken).to.be.undefined;

      // validate body
      expect(r.body).to.have.length(1);
      expect(r).to.have.schemaAnd200(schema);
    };

    return cloud.withOptions(options).get(`/formulas/instances/${formulaInstanceId}/executions`, validator(executionsSchema))
      .then(r => cloud.get(`/formulas/instances/executions/${r.body[0].id}`, executionSchema))
      .then(r => cloud.withOptions(options).get(`/formulas/instances/executions/${r.body.id}/steps`, validator(stepExecutionsSchema)))
      .then(r => cloud.get(`/formulas/instances/executions/steps/${r.body[0].id}`, stepExecutionSchema))
      .then(r => cloud.withOptions(options).get(`/formulas/instances/executions/steps/${r.body.id}/values`, validator(stepExecutionValuesSchema)))
      .then(r => cloud.withOptions(options).get(`/formulas/instances/executions/steps/values/${r.body[0].id}`, stepExecutionValueSchema));
  });
});
