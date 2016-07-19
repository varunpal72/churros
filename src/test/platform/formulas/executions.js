'use strict';

const provisioner = require('core/provisioner');
const cleaner = require('core/cleaner');
const common = require('./assets/common');
const logger = require('winston');
const suite = require('core/suite');
const cloud = require('core/cloud');
const fSchema = require('./assets/schemas/formula.schema');
const fiSchema = require('./assets/schemas/formula.instance.schema');
const sleep = require('sleep');
const tools = require('core/tools');
const expect = require('chakram').expect;
const moment = require('moment');

const provisionSfdcWithPolling = () => provisioner.create('sfdc', {
  'event.notification.enabled': true,
  'event.vendor.type': 'polling',
  'event.poller.refresh_interval': 999999999
});

const flattenStepExecutionValues = sevs =>
  sevs.reduce((flat, curr) => {
    const key = curr.key;
    flat[key] = curr.value;
    return flat;
  }, {});

const consolidateStepExecutionValues = ses =>
  ses.reduce((prev, curr) =>
    Object.assign(prev, flattenStepExecutionValues(curr.stepExecutionValues)),
    ({}));

const validateSimpleSuccessfulRequestTrigger = t => {
  const flat = flattenStepExecutionValues(t.stepExecutionValues);
  expect(flat['trigger.type']).to.equal('request');
  expect(flat).to.have.property('trigger.request.body');
  expect(flat['trigger.request.headers']).to.exist;
  expect(flat['trigger.request.method']).to.equal('GET');
  expect(flat['trigger.request.path']).to.exist;
  expect(flat['trigger.request.query']).to.exist;
  expect(flat['trigger.response.body']).to.exist;
  expect(flat['trigger.response.code']).to.equal('200');
  expect(flat['trigger.response.headers']).to.exist;
};

const validateSimpleSuccessfulScheduledTrigger = t => {
  const flat = flattenStepExecutionValues(t.stepExecutionValues);
  expect(flat['trigger.type']).to.equal('scheduled');
};

const validateStepExecutionStatus = (se, status) => {
  expect(se).to.have.property('status').and.equal(status);
};

const validateSuccessfulStepExecution = se =>
  validateStepExecutionStatus(se, 'success');

const validateErrorStepExecution = se =>
  validateStepExecutionStatus(se, 'failed');

const validateSimpleSuccessfulStepExecutionsForType = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.map(se => validateSuccessfulStepExecution(se));
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
};

const validateSimpleSuccessfulScheduledStepExecutionsForScheduled = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateSuccessfulStepExecution);
};

const validateComplexSuccessfulStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(30);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName === 'invalid-request-step')
    .map(se => expect(se.status).to.equal('failed'));
  ses.filter(se => se.stepName === 'looper' &&
      flattenStepExecutionValues(se.stepExecutionValues)['looper.index'] !== '10')
    .map(validateSuccessfulStepExecution);
  ses.filter(se => se.stepName === 'looper' &&
      flattenStepExecutionValues(se.stepExecutionValues)['looper.index'] === '10')
    .map(validateErrorStepExecution);
  ses.filter(se => se.stepName !== 'invalid-request-step' && se.stepName !== 'looper')
    .map(validateSuccessfulStepExecution);
};

const validateScriptContextSuccessfulStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(4);
  ses.map(se => validateSuccessfulStepExecution(se));
  ses.filter(se => se.stepName === 'trigger').map(tValidator);

  const consolidated = consolidateStepExecutionValues(ses);

  expect(consolidated['customer.id'], 'Step values are being parsed as double, but should be string.').to.equal('8000270E-1392053436');
  expect(consolidated['customer.name']).to.equal('test');
  expect(consolidated['customer-update.id'], 'Step values are being parsed as double, but should be string.').to.equal('8000270E-1392053436');
  expect(consolidated['customer-update.name']).to.equal('test');
  expect(consolidated['customer-update.newthing']).to.equal('{"some":"new thing"}');
  expect(consolidated['customer-retrieve.id'], 'Step values are being parsed as double, but should be string.').to.equal('8000270E-1392053436');
  expect(consolidated['customer-retrieve.name']).to.equal('test');
  expect(consolidated['customer-retrieve.newthing']).to.equal('{"some":"new thing"}');
};

const validateSimpleTimeoutStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateErrorStepExecution);

  const consolidated = consolidateStepExecutionValues(ses);

  expect(consolidated['simple-script.error']).to.contain('Script execution timed out');
};

const validateSimpleV1NoReturnStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateErrorStepExecution);

  const consolidated = consolidateStepExecutionValues(ses);

  expect(consolidated['simple-script.error']).to.contain('The step did not return any values');
};

const validateSimpleV2NoReturnStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateSuccessfulStepExecution);

  const consolidated = consolidateStepExecutionValues(ses);

  expect(consolidated).to.not.contain.key('simple-script.error');
};

const validateSimpleNoReturnConsoleStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateSuccessfulStepExecution);

  const consolidated = consolidateStepExecutionValues(ses);

  expect(JSON.parse(consolidated['simple-script.console'])).to.have.length(1);
};

const validateSimpleErrorStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateErrorStepExecution);

  const consolidated = consolidateStepExecutionValues(ses);

  expect(consolidated['simple-script.error']).to.contain('Script execution failed with message:');
};

const validateSimpleErrorV2StepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateErrorStepExecution);

  const consolidated = consolidateStepExecutionValues(ses);

  expect(consolidated['simple-script.error']).to.contain('Unexpected identifier');
};

const validateLoopSuccessfulLoopStepExecution = se => {
  const flat = flattenStepExecutionValues(se.stepExecutionValues);
  expect(flat['loop.index']).to.not.be.empty;
  const index = parseInt(flat['loop.index']);

  expect(index).to.be.at.least(0);

  if (index === 50) {
    return validateErrorStepExecution(se);
  }

  validateSuccessfulStepExecution(se);
  expect(flat['loop.entry']).to.contain('{"val":0.');
};

const validateLoopSuccessfulEmailStepExecution = se => {
  validateSuccessfulStepExecution(se);
  const flat = flattenStepExecutionValues(se.stepExecutionValues);

  expect(flat['create-email-body.from']).to.equal('devnull@cloud-elements.com');
  expect(flat['create-email-body.to']).to.equal('devnull@cloud-elements.com');
  expect(flat['create-email-body.subject']).to.equal('Formula Email');
  expect(flat['create-email-body.message']).to.contain('Loopy val: 0.');
};

const validateLoopSuccessfulStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(103);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName === 'create-email-body').map(validateLoopSuccessfulEmailStepExecution);
  ses.filter(se => se.stepName === 'loop').map(validateLoopSuccessfulLoopStepExecution);
};

const validateElementRequestSuccessfulStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(7);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateSuccessfulStepExecution);
};

const validateLargePayloadSuccessfulStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(3);
  const consolidated = consolidateStepExecutionValues(ses);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateSuccessfulStepExecution);

  expect(consolidated['simple-script.prop100']).to.exist;
  expect(consolidated['end.triggerobjectid']).to.equal('001i000001hB60bAAC1');
  expect(consolidated['end.prop100']).to.equal(JSON.parse(consolidated['simple-script.prop100']).a);
  expect(consolidated['end.done']).to.equal('true');
};

const validateScriptOnFailureStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(3);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger' && se.stepName !== 'bad-script-step')
    .map(validateSuccessfulStepExecution);
};

const validateStepExecutions = ses => {
  ses.map(se => validateSuccessfulStepExecution(se));
};

const validateExecution = (e, expectedStatus) => validator => {
  const fn = validator || validateStepExecutions;
  const es = expectedStatus || 'success';
  expect(e.status).to.equal(es);
  fn(e.stepExecutions);
};

const getEventsForInstance = id =>
  cloud.get(`/instances/${id}/events`);

const manuallyTriggerInstanceExecution = (fId, fiId, ev) =>
  cloud.post(`/formulas/${fId}/instances/${fiId}/executions`, ev);

const generateTripleSfdcPollingEvent = (instanceId) => {
  const payload = require('./assets/events/triple-event-sfdc');
  return common.generateSfdcPollingEvent(instanceId, payload);
};

const generateSingleSfdcPollingEvent = (instanceId) => {
  const payload = require('./assets/events/single-event-sfdc');
  return common.generateSfdcPollingEvent(instanceId, payload);
};

const generateXSingleSfdcPollingEvents = (instanceId, x) =>
  Promise.all(Array(x).fill().reduce((p, c) => {
    p.push(generateSingleSfdcPollingEvent(instanceId));
    return p;
  }, []));

const validateSuccessfulEventTrigger = num => t => {
  const flat = flattenStepExecutionValues(t.stepExecutionValues);
  expect(flat['trigger.type']).to.equal('event');
  expect(flat['trigger.event']).to.exist;
  expect(flat['trigger.eventId']).to.exist;
};

const validateSuccessfulScheduledTrigger = num => t => {
  const flat = flattenStepExecutionValues(t.stepExecutionValues);
  expect(flat['trigger.type']).to.equal('scheduled');
};

const validateSimpleSuccessfulStepExecutions = {
  forEvents: (num) => validateSimpleSuccessfulStepExecutionsForType(validateSuccessfulEventTrigger(num)),
  forRequest: validateSimpleSuccessfulStepExecutionsForType(validateSimpleSuccessfulRequestTrigger),
  forScheduled: validateSimpleSuccessfulStepExecutionsForType(validateSimpleSuccessfulScheduledTrigger)
};

const validateComplexSuccessfulStepExecutions = {
  forEvents: (num) => validateComplexSuccessfulStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateScriptContextSuccessfulStepExecutions = {
  forEvents: (num) => validateScriptContextSuccessfulStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateSimpleTimeoutStepExecutions = {
  forEvents: (num) => validateSimpleTimeoutStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateSimpleV1NoReturnStepExecutions = {
  forEvents: (num) => validateSimpleV1NoReturnStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateSimpleV2NoReturnStepExecutions = {
  forEvents: (num) => validateSimpleV2NoReturnStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateSimpleNoReturnConsoleStepExecutions = {
  forEvents: (num) => validateSimpleNoReturnConsoleStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateSimpleErrorStepExecutions = {
  forEvents: (num) => validateSimpleErrorStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateSimpleErrorV2StepExecutions = {
  forEvents: (num) => validateSimpleErrorV2StepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateSimpleSuccessfulScheduledStepExecutions = {
  forScheduled: (num) => validateSimpleSuccessfulScheduledStepExecutionsForScheduled(validateSuccessfulScheduledTrigger(num))
};

const validateLoopSuccessfulStepExecutions = {
  forEvents: (num) => validateLoopSuccessfulStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateElementRequestSuccessfulStepExecutions = {
  forEvents: (num) => validateElementRequestSuccessfulStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateLargePayloadSuccessfulStepExecutions = {
  forEvents: (num) => validateLargePayloadSuccessfulStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateScriptOnFailureStepExecutions = {
  forEvents: (num) => validateScriptOnFailureStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

suite.forPlatform('formulas', { name: 'formula executions', skip: false }, (test) => {
  let sfdcId;
  before(() => {
    return provisionSfdcWithPolling()
      .then(r => sfdcId = r.body.id)
      .catch(r => {
        console.log(`Rats...${r}`);
        process.exit(1);
      });
  });

  /**
   * Represents a standard execution test setup, triggering of formula and validation.
   *
   * NOTE: Currently working on re-factoring tests to reduce duplicate code
   */
  const executionTest = (formula, numberOfExecutions, numberOfStepExecutionValues, triggerCb, customExecutionsValidator) => {
    customExecutionsValidator = customExecutionsValidator || ((executions) => logger.debug(`No custom execution validator found`));
    const executionsValidator = (executions) => {
      customExecutionsValidator(executions);
      return executions;
    };

    const trigger = (formulaId, formulaInstanceId) => {
      if (typeof triggerCb === 'function') {
        return triggerCb();
      } else if (typeof triggerCb === 'string' && triggerCb === 'manual') {
        return cloud.post(`/formulas/${formulaId}/instances/${formulaInstanceId}/executions`, { foo: 'bar' });
      }
    };

    // construct the formula instance and add on the sfdcId as the trigger-instance, if necessary
    const formulaInstance = { name: 'churros-instance', };
    const triggerInstance =
      formula.configuration ? formula.configuration.filter(c => c.key === 'trigger-instance') : null;
    if (triggerInstance) formulaInstance.configuration = { 'trigger-instance': sfdcId };

    let fId, fiId;
    return cleaner.formulas.withName(formula.name)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => fId = r.body.id)
      .then(() => cloud.post(`/formulas/${fId}/instances`, formulaInstance, fiSchema))
      .then(r => fiId = r.body.id)
      .then(() => trigger(fId, fiId))
      .then(() => tools.wait.upTo(60000).for(common.allExecutionsCompleted(fId, fiId, numberOfExecutions, numberOfStepExecutionValues)))
      .then(() => common.getFormulaInstanceExecutions(fiId))
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(executions => executionsValidator(executions))
      .then(() => cloud.delete(`/formulas/${fId}/instances/${fiId}`))
      .then(() => cloud.delete(`/formulas/${fId}`));
  };

  /**
   * NOTE: Currently working on re-factoring tests to reduce duplicate code
   */
  const eventTriggerTest = (setup, formula, formulaInstance, numEvents, numStepExecutions, customValidator) => {
    const validator = (executions) => {
      customValidator = (customValidator || ((execution) => logger.debug(`No custom validator found`)));
      customValidator(executions);
    };

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName(formula.name)
      .then(r => setup(formula, formulaInstance))
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateXSingleSfdcPollingEvents(sfdcId, numEvents))
      .then(() => tools.wait.upTo(30000).for(common.allExecutionsCompleted(formulaId, formulaInstanceId, numEvents, numStepExecutions)))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(executions => validator(executions))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  };


  it('should successfully execute a simple formula triggered by a single event', () => {
    const formula = require('./assets/formulas/simple-successful-formula');
    const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple formula triggered by a triple event', () => {
    const formula = require('./assets/formulas/simple-successful-formula');
    const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateTripleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(3);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulStepExecutions.forEvents(3))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a formula and properly handle context between steps', () => {
    const formula = require('./assets/formulas/script-context-successful-formula');
    const formulaInstance = require('./assets/formulas/script-context-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('script-context-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateScriptContextSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a single threaded formula triggered by an event with three objects', () => {
    const formula = require('./assets/formulas/simple-successful-formula-single-threaded');
    const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-successful')
      .then(r => {
        formula.singleThreaded = true;
        formulaInstance.configuration['trigger-instance'] = sfdcId;
      })
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateTripleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(20))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(3);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulStepExecutions.forEvents(3))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a formula with a step that times out', () => {
    const formula = require('./assets/formulas/simple-timeout-formula');
    const formulaInstance = require('./assets/formulas/simple-timeout-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-timeout')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(40))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r, 'failed')(validateSimpleTimeoutStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a formula with a v1 step that returns no values', () => {
    const formula = require('./assets/formulas/simple-no-return-formula-v1');
    const formulaInstance = require('./assets/formulas/simple-no-return-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-no-return')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r, 'failed')(validateSimpleV1NoReturnStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a formula with a v2 step that returns no values', () => {
    const formula = require('./assets/formulas/simple-no-return-formula-v2');
    const formulaInstance = require('./assets/formulas/simple-no-return-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-no-return')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleV2NoReturnStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a formula with a step that returns no values but prints to the console log', () => {
    const formula = require('./assets/formulas/simple-no-return-console-formula');
    const formulaInstance = require('./assets/formulas/simple-no-return-console-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-no-return')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleNoReturnConsoleStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a formula with a v1 step that contains invalid json', () => {
    const formula = require('./assets/formulas/simple-error-formula-v1');
    const formulaInstance = require('./assets/formulas/simple-error-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-error')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r, 'failed')(validateSimpleErrorStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a formula with a v2 step that contains invalid json', () => {
    const formula = require('./assets/formulas/simple-error-formula-v2');
    const formulaInstance = require('./assets/formulas/simple-error-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-error')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r, 'failed')(validateSimpleErrorV2StepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a single threaded formula with a step that contains invalid json, triggered by an event with three objects', () => {
    const setup = (formula, formulaInstance) => {
      formula.singleThreaded = true;
      formulaInstance.configuration['trigger-instance'] = sfdcId;
    };

    const validator = (executions) => executions.map(r => validateExecution(r, 'failed')(validateSimpleErrorStepExecutions.forEvents(2)));

    const formula = require('./assets/formulas/simple-error-formula-v1');
    const formulaInstance = require('./assets/formulas/simple-error-formula-instance');
    return eventTriggerTest(setup, formula, formulaInstance, 3, 2, validator);
  });

  it('should successfully execute a simple formula triggered manually', () => {
    const formula = require('./assets/formulas/simple-successful-formula');
    const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-successful')
      .then(r => {
        formula.singleThreaded = true;
        formulaInstance.configuration['trigger-instance'] = sfdcId;
      })
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5)) // Let the event flow through
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => getEventsForInstance(sfdcId))
      .then(r => manuallyTriggerInstanceExecution(formulaId, formulaInstanceId, r.body[0].notifiedData[0]))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple formula triggered by a request', () => {
    const formula = require('./assets/formulas/simple-successful-request-trigger-formula');
    const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => cloud.get('/hubs/crm/accounts'))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulStepExecutions.forRequest)))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple formula triggered by schedule', () => {
    const formula = require('./assets/formulas/simple-successful-scheduled-trigger-formula');
    const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-successful')
      .then(r => cloud.get('/hubs/crm/ping'))
      .then(r => {
        const currentDt = r.body.dateTime;
        const dt = moment.parseZone(currentDt);
        dt.add(1, 'minute');

        formula.triggers[0].properties.cron = `${dt.seconds()} ${dt.minutes()} ${dt.hours()} ${dt.date()} ${dt.month() + 1} ? ${dt.year()}`;
        formulaInstance.configuration['trigger-instance'] = sfdcId;
      })
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => tools.wait.upTo(90000).for(common.allExecutionsCompleted(formulaId, formulaInstanceId, 1, 2)))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulScheduledStepExecutions.forScheduled())))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple loop formula triggered by a single event', () => {
    const formula = require('./assets/formulas/loop-successful-formula');
    const formulaInstance = require('./assets/formulas/loop-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('loop-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(45))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateLoopSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple element request formula triggered by a single event', () => {
    const formula = require('./assets/formulas/element-request-successful-formula');
    const formulaInstance = require('./assets/formulas/element-request-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('element-request-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(10))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateElementRequestSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a large payload formula triggered by a single event', () => {
    const formula = require('./assets/formulas/large-payload-successful-formula');
    const formulaInstance = require('./assets/formulas/large-payload-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('large-payload-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(20))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateLargePayloadSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should terminate an execution if the deactivate API is called during execution', () => {
    const formula = require('./assets/formulas/loop-formula');
    const formulaInstance = require('./assets/formulas/loop-formula-instance');
    formulaInstance.configuration['sfdc.instance.id'] = sfdcId;

    const isActiveValidation = (r) => {
      expect(r.body).to.not.be.null;
      expect(r.body.active).to.equal(true);
      return r;
    };

    const isStartedValidation = (r) => {
      expect(r.body).to.have.length(1);
      return r;
    };

    const validateTerminatedExecution = (executions) => {
      expect(executions).to.not.be.null;
      expect(executions.stepExecutions).to.have.length.of.at.least(1);

      // look through the step execution values for our *.error value
      let errorValueExists = false;
      executions.stepExecutions.forEach(se => {
        se.stepExecutionValues.forEach(sev => {
          if (sev.key.indexOf('error') >= 0) {
            errorValueExists = true;
            expect(sev.value).to.contain('found inactive');
          }
        });
      });
      expect(errorValueExists).to.equal(true); // by now, this better be true

      return executions;
    };

    let formulaId, formulaInstanceId, formulaInstanceExecutionId;
    return cleaner.formulas.withName('loop-formula')
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => isActiveValidation(r))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId)) // should trigger a formula execution
      .then(() => tools.sleep(10)) // wait for the formula to start executing
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => isStartedValidation(r)) // make sure execution started
      .then(r => formulaInstanceExecutionId = r.body[0].id)
      .then(r => cloud.delete(`/formulas/${formulaId}/instances/${formulaInstanceId}/active`)) // deactivate formula instance
      .then(() => tools.sleep(20)) // wait for the formula to be terminated
      .then(r => common.getFormulaInstanceExecutionWithSteps(formulaInstanceExecutionId))
      .then(r => validateTerminatedExecution(r)) // make sure that the formula was actually deactivated
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute three simple formula instances triggered by a single event', () => {
    const formula = require('./assets/formulas/simple-successful-formula');
    const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

    let formulaId, formulaInstanceId1, formulaInstanceId2, formulaInstanceId3;
    return cleaner.formulas.withName('simple-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId1 = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId2 = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId3 = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(20))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId1))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId2))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId3))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId1))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId2))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId3))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute three different formula instances triggered by a single event', () => {
    const formula1 = require('./assets/formulas/simple-successful-formula');
    const formulaInstance1 = require('./assets/formulas/simple-successful-formula-instance');

    const formula2 = require('./assets/formulas/element-request-successful-formula');
    const formulaInstance2 = require('./assets/formulas/element-request-successful-formula-instance');

    const formula3 = require('./assets/formulas/loop-successful-formula');
    const formulaInstance3 = require('./assets/formulas/loop-successful-formula-instance');

    let formulaId1, formulaId2, formulaId3, formulaInstanceId1, formulaInstanceId2, formulaInstanceId3;
    return cleaner.formulas.withName(['simple-successful', 'element-request-successful', 'loop-successful'])
      .then(r => {
        formulaInstance1.configuration['trigger-instance'] = sfdcId;
        formulaInstance2.configuration['trigger-instance'] = sfdcId;
        formulaInstance3.configuration['trigger-instance'] = sfdcId;
      })
      .then(() => cloud.post(test.api, formula1, fSchema))
      .then(r => formulaId1 = r.body.id)
      .then(() => cloud.post(test.api, formula2, fSchema))
      .then(r => formulaId2 = r.body.id)
      .then(() => cloud.post(test.api, formula3, fSchema))
      .then(r => formulaId3 = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId1}/instances`, formulaInstance1, fiSchema))
      .then(r => formulaInstanceId1 = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId2}/instances`, formulaInstance2, fiSchema))
      .then(r => formulaInstanceId2 = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId3}/instances`, formulaInstance3, fiSchema))
      .then(r => formulaInstanceId3 = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(10))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId1))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId2))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateElementRequestSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId3))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateLoopSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId1, formulaInstanceId1))
      .then(() => common.deleteFormulaInstance(formulaId2, formulaInstanceId2))
      .then(() => common.deleteFormulaInstance(formulaId3, formulaInstanceId3))
      .then(() => common.deleteFormula(formulaId1))
      .then(() => common.deleteFormula(formulaId2))
      .then(() => common.deleteFormula(formulaId3));
  });

  it('should successfully execute one simple formula instance x number of times for x events', () => {
    const formula = require('./assets/formulas/simple-successful-formula');
    const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('simple-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateXSingleSfdcPollingEvents(sfdcId, 10))
      .then(() => tools.wait.for(common.allExecutionsCompleted(formulaId, formulaInstanceId, 10, 2)))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(10);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute one complex formula instance x number of times for x events', () => {
    const formula = require('./assets/formulas/complex-successful-formula');
    const formulaInstance = require('./assets/formulas/complex-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('complex-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateXSingleSfdcPollingEvents(sfdcId, 3))
      .then(() => tools.wait.upTo(300000).for(common.allExecutionsCompleted(formulaId, formulaInstanceId, 3, 30)))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(3);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateComplexSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should support an on failure for a script step', () => {
    const formula = require('./assets/formulas/script-with-on-failure-successful-formula');
    const formulaInstance = require('./assets/formulas/script-with-on-failure-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('script-with-on-failure-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => tools.wait.upTo(60000).for(common.allExecutionsCompleted(formulaId, formulaInstanceId, 1, 3)))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
      .then(rs => rs.map(r => validateExecution(r)(validateScriptOnFailureStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should show a successful execution, even if the last step is a filter step that returns false', () => {
    const formula = require('./assets/formulas/filter-returns-false');
    const formulaInstance = require('./assets/formulas/filter-returns-false-instance');

    let formulaId, formulaInstanceId;
    return cleaner.formulas.withName('filter-returns-false')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => tools.wait.upTo(60000).for(common.allExecutionsCompleted(formulaId, formulaInstanceId, 1, 2)))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.have.length(1);
        const execution = r.body[0];
        expect(execution.status).to.equal('success');
      });
  });

  it('should support a manual trigger type on a formula', () => {
    const formula = require('./assets/formulas/manual-trigger');

    const validator = (executions) => {
      expect(executions).to.have.length(1);
      const execution = executions[0];
      expect(execution.status).to.equal('success');
      const trigger = execution.stepExecutions.filter(se => se.stepName === 'trigger')[0];
      expect(trigger.stepExecutionValues).to.have.length(1);
      const stepExecutionValue = trigger.stepExecutionValues[0];
      expect(stepExecutionValue.value).to.equal('{"foo":"bar"}');
    };

    return executionTest(formula, 1, 2, 'manual', validator);
  });

  it('should retry a request step when the retry property is set to true', () => {
    const formula = require('./assets/formulas/retry-formula');
    const validator = (executions) => {
      expect(executions).to.have.length(1);

      const execution = executions[0];
      expect(execution.status).to.equal('failed');
      expect(execution.stepExecutions).to.have.length(2);

      const stepExecution = execution.stepExecutions.filter(se => se.stepName === 'retry-element-request')[0];

      const stepExecutionValue = stepExecution.stepExecutionValues.filter(sev => sev.key === 'retry-element-request.request.retry-attempt')[0];
      expect(stepExecutionValue.value).to.equal("3");
    };
    const triggerCb = (fId, fiId) => generateSingleSfdcPollingEvent(sfdcId);

    return executionTest(formula, 1, 2, triggerCb, validator);
  });

  it('should have a unique formula context for a single-threaded formula that has multiple polling events trigger multiple executions at once', () => {
    const formula = require('./assets/formulas/single-threaded-formula');
    const triggerCb = (fId, fiId) => generateTripleSfdcPollingEvent(sfdcId);
    const validator = (executions) => {
      // validate that each objectId exists once somewhere in the step execution values
      const events = require('./assets/events/triple-event-sfdc');

      // concatenating all step execution value debug.objectId values into an array
      const all = [];
      executions.forEach(e => {
        const debugStep = e.stepExecutions.filter((se) => se.stepName === 'debug')[0];
        all.push(debugStep.stepExecutionValues.filter((sev) => sev.key === 'debug.objectId')[0].value);
      });

      // make sure that for each account in our event that we pumped in, that step execution value existed
      events.accounts.forEach(account => expect(all.indexOf(account.Id)).to.be.above(-1));
    };

    return executionTest(formula, 3, 2, triggerCb, validator);
  });

  /** Clean up */
  after(done => {
    if (!sfdcId) done();
    return provisioner.delete(sfdcId)
      .then(() => done())
      .catch(e => {
        console.log(`Crap! ${e}`);
        done();
      });
  });
});
