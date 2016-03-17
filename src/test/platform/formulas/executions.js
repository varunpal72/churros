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

const validateStepExecutions = ses => {
  ses.map(se => validateSuccessfulStepExecution(se));
};

const validateExecution = e => validator => {
  const fn = validator || validateStepExecutions;
  fn(e.stepExecutions);
};

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

const validateSimpleSuccessfulStepExecutions = {
  forEvents: (num) => validateSimpleSuccessfulStepExecutionsForType(validateSuccessfulEventTrigger(num)),
  forRequest: validateSimpleSuccessfulStepExecutionsForType(validateSimpleSuccessfulRequestTrigger),
  forScheduled: validateSimpleSuccessfulStepExecutionsForType(validateSimpleSuccessfulScheduledTrigger)
};

const validateScriptContextSuccessfulStepExecutions = {
  forEvents: (num) => validateScriptContextSuccessfulStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
}

const validateSimpleTimeoutStepExecutions = {
  forEvents: (num) => validateSimpleTimeoutStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
}

const validateSimpleNoReturnStepExecutions = {
  forEvents: (num) => validateSimpleNoReturnStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
}

const validateSimpleErrorStepExecutions = {
  forEvents: (num) => validateSimpleErrorStepExecutionsForEvents(validateSuccessfulEventTrigger(num))
}

suite.forPlatform('formulas', null, null, (test) => {
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
  after(done => provisioner.delete(sfdcId).then(() => done()).catch(e => { console.log(`Crap! ${e}`); done(); }));
});
