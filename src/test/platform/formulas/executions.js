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

const validateTriggerBodyEvents = (tb, num) => {
  expect(tb.message.events).to.have.length(num);
};

const validateSuccessfulEventTrigger = num => t => {
  const flat = flattenStepExecutionValues(t.stepExecutionValues);
  expect(flat['trigger.type']).to.equal('event');
  expect(flat['trigger.event']).to.exist;
  expect(flat['trigger.eventId']).to.exist;
  validateTriggerBodyEvents(JSON.parse(flat['trigger.body']), num);
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

suite.forPlatform('formulas', { name: 'formula executions' }, (test) => {
  let sfdcId;
  before(done => provisionSfdcWithPolling().then(r => {
    sfdcId = r.body.id;
    done();
  }));

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
                  .then(r => {
                    expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
                    return r;
                  })
                  .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
                  .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(1))))
                  .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
                  .then(() => common.deleteFormula(formulaId));
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
                  .then(r => {
                    expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(3);
                    return r;
                  })
                  .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
                  .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleSuccessfulStepExecutions.forEvents(3))))
                  .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
                  .then(() => common.deleteFormula(formulaId));
              });
          });
      });
  });

  it('should successfully execute a formula and properly handle context between steps', () => {
    return common.deleteFormulasByName(test.api, 'script-context-successful')
      .then(r => {
        const formula = require('./assets/script-context-successful-formula');
        const formulaInstance = require('./assets/script-context-successful-formula-instance');

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
                  .then(r => {
                    expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
                    return r;
                  })
                  .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
                  .then(rs => rs.map(r => validateExecution(r.body)(validateScriptContextSuccessfulStepExecutions.forEvents(1))))
                  .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
                  .then(() => common.deleteFormula(formulaId));
              });
          });
      });
  });

  it('should successfully execute a single threaded formula triggered by an event with three objects', () => {
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(r => {
        const formula = require('./assets/simple-successful-formula');
        formula.singleThreaded = true;
        const formulaInstance = require('./assets/simple-successful-formula-instance');

        formulaInstance.configuration['trigger-instance'] = sfdcId;

        return cloud.post(test.api, formula, fSchema)
          .then(r => {
            const formulaId = r.body.id;
            return cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema)
              .then(r => {
                const formulaInstanceId = r.body.id;
                return generateTripleSfdcPollingEvent(sfdcId)
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
          });
      });
  });

  it('should properly handle a formula with a step that times out', () => {
    return common.deleteFormulasByName(test.api, 'simple-timeout')
      .then(r => {
        const formula = require('./assets/simple-timeout-formula');
        const formulaInstance = require('./assets/simple-timeout-formula-instance');

        formulaInstance.configuration['trigger-instance'] = sfdcId;

        return cloud.post(test.api, formula, fSchema)
          .then(r => {
            const formulaId = r.body.id;
            return cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema)
              .then(r => {
                const formulaInstanceId = r.body.id;
                return generateSingleSfdcPollingEvent(sfdcId)
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
          });
      });
  });

  it('should properly handle a formula with a step that returns no values', () => {
    return common.deleteFormulasByName(test.api, 'simple-no-return')
      .then(r => {
        const formula = require('./assets/simple-no-return-formula');
        const formulaInstance = require('./assets/simple-no-return-formula-instance');

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
                  .then(r => {
                    expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
                    return r;
                  })
                  .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
                  .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleNoReturnStepExecutions.forEvents(1))))
                  .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
                  .then(() => common.deleteFormula(formulaId));
              });
          });
      });
  });

  it('should properly handle a formula with a step that contains invalid json', () => {
    return common.deleteFormulasByName(test.api, 'simple-error')
      .then(r => {
        const formula = require('./assets/simple-error-formula');
        const formulaInstance = require('./assets/simple-error-formula-instance');

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
                  .then(r => {
                    expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(1);
                    return r;
                  })
                  .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
                  .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleErrorStepExecutions.forEvents(1))))
                  .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
                  .then(() => common.deleteFormula(formulaId));
              });
          });
      });
  });

  it('should properly handle a single threaded formula with a step that contains invalid json, triggered by an event with three objects', () => {
    return common.deleteFormulasByName(test.api, 'simple-error')
      .then(r => {
        const formula = require('./assets/simple-error-formula');
        const formulaInstance = require('./assets/simple-error-formula-instance');

        formula.singleThreaded = true;
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
                  .then(r => {
                    expect(r).to.have.statusCode(200) && expect(r.body).to.have.length(3);
                    return r;
                  })
                  .then(r => Promise.all(r.body.map(fie => common.getFormulaInstanceExecution(formulaId, formulaInstanceId, fie.id))))
                  .then(rs => rs.map(r => validateExecution(r.body)(validateSimpleErrorStepExecutions.forEvents(3))))
                  .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId))
                  .then(() => common.deleteFormula(formulaId));
              });
          });
      });
  });

  it('should successfully execute a simple formula triggered manually', () => {
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(r => {
        const formula = require('./assets/simple-successful-formula');
        const formulaInstance = require('./assets/simple-successful-formula-instance');

        formula.singleThreaded = true;
        formulaInstance.configuration['trigger-instance'] = sfdcId;

        return generateSingleSfdcPollingEvent(sfdcId)
          .then(() => sleep.sleep(5)) // Let the event flow through
          .then(() => cloud.post(test.api, formula, fSchema))
          .then(r => {
            const formulaId = r.body.id;
            return cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema)
              .then(r => {
                const formulaInstanceId = r.body.id;
                return getEventsForInstance(sfdcId)
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
          });
      });
  });

  it('should successfully execute a simple formula triggered by a request', () => {
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(r => {
        const formula = require('./assets/simple-successful-request-trigger-formula');
        const formulaInstance = require('./assets/simple-successful-formula-instance');

        formula.singleThreaded = true;
        formulaInstance.configuration['trigger-instance'] = sfdcId;

        return cloud.post(test.api, formula, fSchema)
          .then(r => {
            const formulaId = r.body.id;
            return cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema)
              .then(r => {
                const formulaInstanceId = r.body.id;
                return chakram.get('/hubs/crm/accounts')
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
          });
      });
  });

  it('should successfully execute a simple formula triggered by schedule', () => {
    return common.deleteFormulasByName(test.api, 'simple-successful')
      .then(r => chakram.get('/hubs/crm/ping'))
      .then(r => {
        const currentDt = r.body.dateTime;
        const dt = new Date(currentDt);
        dt.setSeconds(dt.getSeconds() + 30);

        const formula = require('./assets/simple-successful-scheduled-trigger-formula');

        formula.triggers[0].properties.cron = `${dt.getSeconds()} ${dt.getMinutes()} ${dt.getHours()} ${dt.getDate()} ${dt.getMonth() + 1} ? ${dt.getFullYear()}`;

        const formulaInstance = require('./assets/simple-successful-formula-instance');

        formulaInstance.configuration['trigger-instance'] = sfdcId;

        return cloud.post(test.api, formula, fSchema)
          .then(r => {
            const formulaId = r.body.id;
            return cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema)
              .then(r => {
                const formulaInstanceId = r.body.id;
                  return Promise.all([sleep.sleep(35)])
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
          });
      });
  });

  it('should successfully execute a simple loop formula triggered by a single event', () => {
    return common.deleteFormulasByName(test.api, 'loop-successful')
      .then(r => {
        const formula = require('./assets/loop-successful-formula');
        const formulaInstance = require('./assets/loop-successful-formula-instance');

        formulaInstance.configuration['trigger-instance'] = sfdcId;

        return cloud.post(test.api, formula, fSchema)
          .then(r => {
            const formulaId = r.body.id;
            return cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema)
              .then(r => {
                const formulaInstanceId = r.body.id;
                return generateSingleSfdcPollingEvent(sfdcId)
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
          });
      });
  });

  it('should successfully execute a simple element request formula triggered by a single event', () => {
    return common.deleteFormulasByName(test.api, 'element-request-successful')
      .then(r => {
        const formula = require('./assets/element-request-successful-formula');
        const formulaInstance = require('./assets/element-request-successful-formula-instance');

        formulaInstance.configuration['trigger-instance'] = sfdcId;

        return cloud.post(test.api, formula, fSchema)
          .then(r => {
            const formulaId = r.body.id;
            return cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema)
              .then(r => {
                const formulaInstanceId = r.body.id;
                return generateSingleSfdcPollingEvent(sfdcId)
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
          });
      });
  });

  it('should successfully execute a large payload formula triggered by a single event', () => {
    return common.deleteFormulasByName(test.api, 'large-payload-successful')
      .then(r => {
        const formula = require('./assets/large-payload-successful-formula');
        const formulaInstance = require('./assets/large-payload-successful-formula-instance');

        formulaInstance.configuration['trigger-instance'] = sfdcId;

        return cloud.post(test.api, formula, fSchema)
          .then(r => {
            const formulaId = r.body.id;
            return cloud.post(util.format('/formulas/%s/instances', formulaId), formulaInstance, fiSchema)
              .then(r => {
                const formulaInstanceId = r.body.id;
                return generateSingleSfdcPollingEvent(sfdcId)
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
          });
      });
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

  /** Clean up */
  after(done => provisioner.delete(sfdcId).then(() => done()).catch(e => { console.log(`Crap! ${e}`); done(); }));
});
