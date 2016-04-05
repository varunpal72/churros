'use strict';

const suite = require('core/suite');
const common = require('./assets/common');
const provisioner = require('core/provisioner');
const cloud = require('core/cloud');
const fSchema = require('./assets/schemas/formula.schema');
const fiSchema = require('./assets/schemas/formula.instance.schema');
const chakram = require('chakram');
const expect = chakram.expect;
const logger = require('winston');
const tools = require('core/tools');

/**
 * {
 *   "objectType": type,
 *   "instance_id": elementInstanceId,
 *   type: [
 *     {
 *       objects
 *     }
 *   ]
 * }
 */
const genPollingEvent = (instanceId, type, num) => {
  const event = require('./assets/events/large-event');
  const events = [];
  for (let i = 0; i < num; i++) {
    events.push(event);
  }
  return { objectType: type, instance_id: instanceId, type: events };
};

const genWebhookEvent = (action, num) => {
  const event = require('./assets/events/raw-webhook');
  const events = [];
  for (let i = 0; i < num; i++) {
    events.push(event);
  }
  return { action: action, objects: events };
};

const simulateTrigger = (num, instanceId, payload, simulateCb) => {
  const all = [];
  for (let i = 0; i < num; i++) {
    all.push(simulateCb(instanceId, payload));
  }
  return chakram.all(all);
};

const pollExecutions = (formulaId, formulaInstanceId, numExpected, attemptNum) => {
  return common.getAllExecutions(formulaId, formulaInstanceId)
    .then(executions => {
      if (executions.length < numExpected) {
        if (attemptNum > 100) {
          // return common.deleteFormulaInstance(formulaId, formulaInstanceId)
          //   .then(r => {
          throw Error(`Attempt limit of 100 exceeded, quitting`);
          // });
        }

        logger.debug(`Attempt number ${attemptNum} only found ${executions.length}/${numExpected} executions so far, polling...`);
        tools.sleep(5);
        return pollExecutions(formulaId, formulaInstanceId, numExpected, attemptNum + 1);
      }

      logger.debug(`All ${numExpected} executions started`);
      return executions;
    });
};

const createXInstances = (x, formulaId, formulaInstance) => {
  const ids = [];
  return cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema)
    .then(r => {
      expect(r).to.have.statusCode(200);
      ids.push(r.body.id);
      const all = [];
      for (let i = 0; i < x - 1; i++) {
        all.push(cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema));
      }
      return chakram.all(all);
    })
    .then(rs => {
      rs.map(r => ids.push(r.body.id));
      return ids;
    });
};

/**
 * Tests formula executions under heavy load (number of events, size of events, etc.)
 */
suite.forPlatform('formulas', { name: 'formulas load' }, (test) => {
  let sfdcId;
  before(() => common.deleteFormulasByName(test.api, 'complex-successful')
    .then(r => common.provisionSfdcWithWebhook())
    .then(r => sfdcId = r.body.id));

  /** Clean up */
  after(() => {
    if (sfdcId) return provisioner.delete(sfdcId);
  });

  it('should handle a very large event payload repeatedly', () => {
    const formula = require('./assets/complex-successful-formula');
    const formulaInstance = require('./assets/complex-successful-formula-instance');
    formulaInstance.configuration['trigger-instance'] = sfdcId;

    const numInOneEvent = 200;
    const numEvents = 5;
    let formulaId;
    let formulaInstances = [];
    return cloud.post(test.api, formula, fSchema)
      .then(r => formulaId = r.body.id)
      .then(() => createXInstances(4, formulaId, formulaInstance))
      .then(ids => ids.map(id => formulaInstances.push(id)))
      .then(r => simulateTrigger(numEvents, sfdcId, genWebhookEvent('update', 200), common.generateSfdcEvent))
      .then(r => pollExecutions(formulaId, formulaInstances[0], numInOneEvent * numEvents, 1))
      .then(r => formulaInstances.map(id => cloud.delete(`/formulas/${formulaId}/instances/${id}`)))
      .then(r => common.deleteFormula(formulaId));
  });
});
