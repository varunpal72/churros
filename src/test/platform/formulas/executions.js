'use strict';

const provisioner = require('core/provisioner');
const common = require('./assets/common');
const util = require('util');
const suite = require('core/suite');
const cloud = require('core/cloud');
const fSchema = require('./assets/formula.schema');
const fiSchema = require('./assets/formula.instance.schema');
const chakram = require('chakram');
const b64 = require('core/tools').base64Encode;
const sleep = require('sleep');
const expect = require('chakram').expect;

const provisionSfdcWithPolling = () => provisioner.create('sfdc',
  {'event.notification.enabled': true,
    'event.vendor.type': 'polling',
    'event.poller.refresh_interval': 999999999});

suite.forPlatform('formulas', null, null, (test) => {
  let sfdcId;
  before(done => provisionSfdcWithPolling().then(r => { sfdcId = r.body.id; done(); }));

  it('should successfully execute a simple formula triggered by a single event', () => {
    return common.deleteFormulasByName(test.api, 'simple-successful')
        .then(r => {
          const formula = require('./assets/simple-successful-formula');
          const formulaInstance = require('./assets/simple-successful-formula-instance');

          formulaInstance.configuration['trigger-instance'] = sfdcId;

          return cloud.post(test.api, formula, fSchema)
            .then(r => {
              const formulaId = r.body.id;
              return cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema)
                .then(r => {
                  const formulaInstanceId = r.body.id;
                  return generateSingleSfdcPollingEvent(sfdcId)
                    .then(() => sleep.sleep(5))
                    .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
                    .then(r => { expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1); return r; })
                    .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
                    .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
                    .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
                    .then(() => common.deleteFormula(formulaId))
                  });
            });
        });
  });

  it('should successfully execute a simple formula triggered by a triple event', () => {
    return common.deleteFormulasByName(test.api, 'simple-successful')
        .then(r => {
          const formula = require('./assets/simple-successful-formula');
          const formulaInstance = require('./assets/simple-successful-formula-instance');

          formulaInstance.configuration['trigger-instance'] = sfdcId;

          return cloud.post(test.api, formula, fSchema)
            .then(r => {
              const formulaId = r.body.id;
              return cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema)
                .then(r => {
                  const formulaInstanceId = r.body.id;
                  return generateTripleSfdcPollingEvent(sfdcId)
                    .then(() => sleep.sleep(5))
                    .then(() => common.getFormulaInstanceExecutions(formulaId, formulaInstanceId))
                    .then(r => { expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(3); return r; })
                    .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
                    .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(3))))
                    .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
                    .then(() => common.deleteFormula(formulaId))
                  });
            });
        });
  });

  after(done => { provisioner.delete(sfdcId).then(() => done()) });
});

const validateStepExecution = se => {
  expect(se).to.have.property('status').and.equal('success');
};

const flattenStepExecutionValues = sevs =>
  sevs.reduce((flat, curr) => {
    const key = curr.key;
    flat[key] = curr.value;
    return flat;
  }, {});

const validateTriggerBodyEvents = (tb, num) => {
  expect(tb.message.events).to.have.length(num);
}

const validateSimpleSuccessfulEventTrigger = num => t => {
  const flat = flattenStepExecutionValues(t.stepExecutionValues)
  expect(flat['trigger.type']).to.equal('event');
  expect(flat['trigger.event']).to.exist;
  expect(flat['trigger.eventId']).to.exist;
  validateTriggerBodyEvents(JSON.parse(flat['trigger.body']), num);
};
const validateSimpleSuccessfulRequestTrigger = t => {
  const flat = flattenStepExecutionValues(t.stepExecutionValues)
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
  const flat = flattenStepExecutionValues(t.stepExecutionValues)
  expect(flat['trigger.type']).to.equal('scheduled');
};
const validateSimpleSuccessfulStepExecutionsForType = tValidator => ses => {
  expect(ses).to.have.length(2);
  ses.map(se => validateStepExecution(se));
  ses.filter(se => se.stepName === 'trigger').map(tValidator);
};
const validateSimpleSuccessfulStepExecutions = {
  forEvents: (num) => validateSimpleSuccessfulStepExecutionsForType(validateSimpleSuccessfulEventTrigger(num)),
  forRequest: validateSimpleSuccessfulStepExecutionsForType(validateSimpleSuccessfulRequestTrigger),
  forScheduled: validateSimpleSuccessfulStepExecutionsForType(validateSimpleSuccessfulScheduledTrigger)
};

const validateStepExecutions = ses => {
  ses.map(se => validateStepExecution(se));
};

const validateExecution = e => validator => {
  const fn = validator || validateStepExecutions;
  fn(e.stepExecutions);
}

const generateTripleSfdcPollingEvent = (instanceId) => {
  const payload = require('./assets/triple-event-sfdc');
  return generateSfdcPollingEvent(instanceId, payload);
};

const generateSingleSfdcPollingEvent = (instanceId) => {
  const payload = require('./assets/single-event-sfdc');
  return generateSfdcPollingEvent(instanceId, payload);
};

const generateSfdcPollingEvent = (instanceId, payload) => {
  const headers = { 'Content-Type': 'application/json', 'Id': instanceId };
  const encodedId = b64(instanceId.toString());

  payload.instance_id = instanceId;

  return chakram.post('/events/sfdcPolling/' + encodedId, payload, {'headers': headers});
};
