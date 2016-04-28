'use strict';

const provisioner = require('core/provisioner');
const common = require('./assets/common');
const util = require('util');
const suite = require('core/suite');
const cloud = require('core/cloud');
const fSchema = require('./assets/schemas/formula.schema');
const fiSchema = require('./assets/schemas/formula.instance.schema');
const chakram = require('chakram');
const tools = require('core/tools');
const b64 = tools.base64Encode;
const sleep = require('sleep');
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
  expect(flat['trigger.request.body']).to.exist;
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

const validateStepExecutionStatus = (se, status) =>
  expect(se).to.have.property('status').and.equal(status);

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

  expect(consolidated['simple-script.error']).to.contain('Script timed out after');
};

const validateSimpleNoReturnStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateErrorStepExecution);

  const consolidated = consolidateStepExecutionValues(ses);

  expect(consolidated['simple-script.error']).to.contain('The step did not return any values');
};

const validateSimpleErrorStepExecutionsForEvents = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
  ses.filter(se => se.stepName !== 'trigger').map(validateErrorStepExecution);

  const consolidated = consolidateStepExecutionValues(ses);

  expect(consolidated['simple-script.error']).to.contain('Script execution failed with message:');
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

const validateExecution = e => validator => {
  const fn = validator || validateStepExecutions;
  fn(e.stepExecutions);
};

const getEventsForInstance = id =>
  chakram.get(`/instances/${id}/events`);

const manuallyTriggerInstanceExecution = (fId, fiId, ev) =>
  chakram.post(`/formulas/${fId}/instances/${fiId}/executions`, ev);

const generateSfdcPollingEvent = (instanceId, payload) => {
  const headers = { 'Content-Type': 'application/json', 'Id': instanceId };
  const encodedId = b64(instanceId.toString());

  payload.instance_id = instanceId;

  return chakram.post('/events/sfdcPolling/' + encodedId, payload, { 'headers': headers });
};

const generateTripleSfdcPollingEvent = (instanceId) => {
  const payload = require('./assets/triple-event-sfdc');
  return generateSfdcPollingEvent(instanceId, payload);
};

const generateSingleSfdcPollingEvent = (instanceId) => {
  const payload = require('./assets/single-event-sfdc');
  return generateSfdcPollingEvent(instanceId, payload);
};

const generateXSingleSfdcPollingEvents = (instanceId, x) =>
  Promise.all(Array(x).fill().reduce((p, c) => {
    p.push(generateSingleSfdcPollingEvent(instanceId));
    return p;
  }, []));

// const validateTriggerBodyEvents = (tb, num) => {
//   expect(tb.message.events).to.have.length(num);
// };

const validateSuccessfulEventTrigger = num => t => {
  const flat = flattenStepExecutionValues(t.stepExecutionValues);
  expect(flat['trigger.type']).to.equal('event');
  expect(flat['trigger.event']).to.exist;
  expect(flat['trigger.eventId']).to.exist;
  // validateTriggerBodyEvents(JSON.parse(flat['trigger.body']), num);
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

const validateSimpleNoReturnStepExecutions = {
  forEvents: (num) => validateSimpleNoReturnStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
};

const validateSimpleErrorStepExecutions = {
  forEvents: (num) => validateSimpleErrorStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
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

suite.forPlatform('formulas', { name: 'formula executions' }, (test) => {
  let sfdcId;
  before(done => provisionSfdcWithPolling().then(r => {
    sfdcId = r.body.id;
    done();
  }));

  it('should successfully execute a simple formula triggered by a single event', () => {
    const formula = require('./assets/simple-successful-formula');
    const formulaInstance = require('./assets/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple formula triggered by a triple event', () => {
    const formula = require('./assets/simple-successful-formula');
    const formulaInstance = require('./assets/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateTripleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(3);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(3))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a formula and properly handle context between steps', () => {
    const formula = require('./assets/script-context-successful-formula');
    const formulaInstance = require('./assets/script-context-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'script-context-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateScriptContextSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a single threaded formula triggered by an event with three objects', () => {
    const formula = require('./assets/simple-successful-formula');
    const formulaInstance = require('./assets/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(r => {
        formula.singleThreaded = true;
        formulaInstance.configuration['trigger-instance'] = sfdcId;
      })
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateTripleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(10))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(3);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(3))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a formula with a step that times out', () => {
    const formula = require('./assets/simple-timeout-formula');
    const formulaInstance = require('./assets/simple-timeout-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-timeout')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(40))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleTimeoutStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a formula with a step that returns no values', () => {
    const formula = require('./assets/simple-no-return-formula');
    const formulaInstance = require('./assets/simple-no-return-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-no-return')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleNoReturnStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a formula with a step that contains invalid json', () => {
    const formula = require('./assets/simple-error-formula');
    const formulaInstance = require('./assets/simple-error-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-error')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleErrorStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should properly handle a single threaded formula with a step that contains invalid json, triggered by an event with three objects', () => {
    const formula = require('./assets/simple-error-formula');
    const formulaInstance = require('./assets/simple-error-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-error')
      .then(r => {
        formula.singleThreaded = true;
        formulaInstance.configuration['trigger-instance'] = sfdcId;
      })
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateTripleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(3);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleErrorStepExecutions.forEvents(3))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple formula triggered manually', () => {
    const formula = require('./assets/simple-successful-formula');
    const formulaInstance = require('./assets/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-successful')
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
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple formula triggered by a request', () => {
    const formula = require('./assets/simple-successful-request-trigger-formula');
    const formulaInstance = require('./assets/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(r => {
        formula.singleThreaded = true;
        formulaInstance.configuration['trigger-instance'] = sfdcId;
      })
      .then(() =>cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => chakram.get('/hubs/crm/accounts'))
      .then(() => sleep.sleep(5))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleErrorStepExecutions.forRequest)))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple formula triggered by schedule', () => {
    const formula = require('./assets/simple-successful-scheduled-trigger-formula');
    const formulaInstance = require('./assets/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(r => chakram.get('/hubs/crm/ping'))
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
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulScheduledStepExecutions.forScheduled())))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple loop formula triggered by a single event', () => {
    const formula = require('./assets/loop-successful-formula');
    const formulaInstance = require('./assets/loop-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'loop-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(15))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateLoopSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a simple element request formula triggered by a single event', () => {
    const formula = require('./assets/element-request-successful-formula');
    const formulaInstance = require('./assets/element-request-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'element-request-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(10))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateElementRequestSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute a large payload formula triggered by a single event', () => {
    const formula = require('./assets/large-payload-successful-formula');
    const formulaInstance = require('./assets/large-payload-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'large-payload-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => sleep.sleep(20))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateLargePayloadSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should terminate an execution if the deactivate API is called during execution', () => {
    const formula = require('./assets/loop-formula');
    const formulaInstance = require('./assets/loop-formula-instance');
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
    return common.deleteFormulasByName(test.api, 'loop-formula')
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => isActiveValidation(r))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId)) // should trigger a formula execution
      .then(() => tools.sleep(10)) // wait for the formula to start executing
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => isStartedValidation(r)) // make sure execution started
      .then(r => formulaInstanceExecutionId = r.body[0].id)
      .then(r => cloud.delete(`/formulas/${formulaId}/instances/${formulaInstanceId}/active`)) // deactivate formula instance
      .then(() => tools.sleep(10)) // wait for the formula to be terminated
      .then(r => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, formulaInstanceExecutionId))
      .then(r => validateTerminatedExecution(r.body)) // make sure that the formula was actually deactivated
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute three simple formula instances triggered by a single event', () => {
    const formula = require('./assets/simple-successful-formula');
    const formulaInstance = require('./assets/simple-successful-formula-instance');

    let formulaId, formulaInstanceId1, formulaInstanceId2, formulaInstanceId3;
    return common.deleteFormulasByName(test.api, 'simple-successful')
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
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId1))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId1, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId2))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId2, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId3))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId3, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId1))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId2))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId3))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute three different formula instances triggered by a single event', () => {
    const formula1 = require('./assets/simple-successful-formula');
    const formulaInstance1 = require('./assets/simple-successful-formula-instance');

    const formula2 = require('./assets/element-request-successful-formula');
    const formulaInstance2 = require('./assets/element-request-successful-formula-instance');

    const formula3 = require('./assets/loop-successful-formula');
    const formulaInstance3 = require('./assets/loop-successful-formula-instance');

    let formulaId1, formulaId2, formulaId3, formulaInstanceId1, formulaInstanceId2, formulaInstanceId3;
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(() => common.deleteFormulasByName(test.api, 'element-request-successful'))
      .then(() => common.deleteFormulasByName(test.api, 'loop-successful'))
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
      .then(() => common.getFormulaInstanceExecutions(formulaId1, formulaInstanceId1))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId1, formulaInstanceId1, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.getFormulaInstanceExecutions(formulaId2, formulaInstanceId2))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId2, formulaInstanceId2, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateElementRequestSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.getFormulaInstanceExecutions(formulaId3, formulaInstanceId3))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId3, formulaInstanceId3, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateLoopSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId1, formulaInstanceId1))
      .then(() => common.deleteFormulaInstance(formulaId2, formulaInstanceId2))
      .then(() => common.deleteFormulaInstance(formulaId3, formulaInstanceId3))
      .then(() => common.deleteFormula(formulaId1))
      .then(() => common.deleteFormula(formulaId2))
      .then(() => common.deleteFormula(formulaId3));
  });

  it('should successfully execute one simple formula instance x number of times for x events', () => {
    const formula = require('./assets/simple-successful-formula');
    const formulaInstance = require('./assets/simple-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateXSingleSfdcPollingEvents(sfdcId, 100))
      .then(() => tools.wait.for(common.allExecutionsCompleted(formulaId, formulaInstanceId, 100, 2)))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(100);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should successfully execute one complex formula instance x number of times for x events', () => {
    const formula = require('./assets/complex-successful-formula');
    const formulaInstance = require('./assets/complex-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'complex-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateXSingleSfdcPollingEvents(sfdcId, 10))
      .then(() => tools.wait.upTo(300000).for(common.allExecutionsCompleted(formulaId, formulaInstanceId, 10, 30)))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(10);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateComplexSuccessfulStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  it('should support an on failure for a script step', () => {
    const formula = require('./assets/script-with-on-failure-successful-formula');
    const formulaInstance = require('./assets/script-with-on-failure-successful-formula-instance');

    let formulaId, formulaInstanceId;
    return common.deleteFormulasByName(test.api, 'script-with-on-failure-successful')
      .then(r => formulaInstance.configuration['trigger-instance'] = sfdcId)
      .then(() => cloud.post(test.api, formula, fSchema))
      .then(r => formulaId = r.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
      .then(r => formulaInstanceId = r.body.id)
      .then(() => generateSingleSfdcPollingEvent(sfdcId))
      .then(() => tools.wait.upTo(60000).for(common.allExecutionsCompleted(formulaId, formulaInstanceId, 1, 3)))
      .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
      .then(r => {
        expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
        return r;
      })
      .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
      .then(rs => rs.map(r => validateExecution(r.body)(validateScriptOnFailureStepExecutions.forEvents(1))))
      .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
      .then(() => common.deleteFormula(formulaId));
  });

  /** Clean up */
  after(done => provisioner.delete(sfdcId).then(() => done()).catch(e => { console.log(`Crap! ${e}`); done(); }));
});
