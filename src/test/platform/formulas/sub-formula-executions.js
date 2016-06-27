'use strict';

const common = require('./assets/common');
const cleaner = require('core/cleaner');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const logger = require('winston');
const suite = require('core/suite');
const provisioner = require('core/provisioner');
const tools = require('core/tools');

/* JSON */
const simpleFormulas = require('./assets/formulas/sub-formula-executions/simple-sub-formulas');
const twoSubFormulas = require('./assets/formulas/sub-formula-executions/two-sub-formulas');
const twoSubFormulasNoAfter = require('./assets/formulas/sub-formula-executions/two-sub-formulas-no-steps-after');
const manualSubFormulas = require('./assets/formulas/sub-formula-executions/manual-sub-formulas');
const filterSubFormulas = require('./assets/formulas/sub-formula-executions/filter-sub-formulas');
const event = require('./assets/events/single-event-sfdc');

suite.forPlatform('formulas', { name: 'formula executions: sub formulas' }, (test) => {
  const cleanFormulas = () => {
    const names = simpleFormulas.map(f => f.name)
      .concat(twoSubFormulas.map(f => f.name))
      .concat(twoSubFormulasNoAfter.map(f => f.name))
      .concat(manualSubFormulas.map(f => f.name))
      .concat(filterSubFormulas.map(f => f.name));
    return cleaner.formulas.withNames(names);
  };

  /* Create SFDC element with events enabled */
  let sfdcId;
  before(() => {
    const config = { 'event.notification.enabled': true, 'event.vendor.type': 'polling', 'event.poller.refresh_interval': 999999999 };
    return cleanFormulas()
      .then(r => provisioner.create('sfdc', config))
      .then(r => sfdcId = r.body.id)
      .catch(e => tools.logAndThrow('Failed to run before()', e));
  });

  const buildConfig = (triggerId) => ({ name: 'churros-instance', configuration: { 'crm.instance': triggerId } });

  const setProperty = (allFormulas, formulaName, stepNames, value) => {
    if (typeof stepNames === 'string') stepNames = [stepNames];

    stepNames.map(stepName =>
      allFormulas.filter(f => f.name === formulaName)[0]
      .steps.filter(step => step.name === stepName)[0]
      .properties.formulaId = value
    );
  };

  const validateExecution = (response) => {
    expect(response).to.have.statusCode(200);
    expect(response.body).to.have.length(1);
    return response;
  };

  const single = (formulaList, name) => {
    const formula = formulaList.filter(formula => formula.name === name)[0];
    if (!formula) throw Error(`No formula found with name: ${name}`);
    return formula;
  };

  const defaultValidator = (executions) => {
    expect(executions).to.have.length(1);
    const execution = executions[0];
    expect(execution.status).to.equal('success');
    const stepExecutions = execution.stepExecutions;
    expect(stepExecutions.filter(se => se.status !== 'success')).to.have.length(0);
    return executions;
  };

  /**
   * The standard execution test logic which:
   * * runs the setup function that *must* return the top-level parent formula that we will create a formula instance of
   *   and then go about executing
   * * generates an event for the trigger instance
   * * waits for all steps executions to complete
   * * ensures there is one execution of the formula
   * * validates the step execution values appropriately
   */
  const executionTest = (setup, expectedNumSteps, customValidator) => {
    if (!setup) throw Error('No setup function found.  Need a setup function that returns the formula that we should create a formula instance of');

    // default step execution validator
    customValidator = customValidator || ((executions) => logger.debug(`No validation of executions for: ${tools.stringify(executions)}`));

    let formulaId, formulaInstanceId;
    return setup()
      .then(formula => formulaId = formula.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, buildConfig(sfdcId)))
      .then(formulaInstance => formulaInstanceId = formulaInstance.body.id)
      .then(() => common.generateSfdcPollingEvent(sfdcId, event))
      .then(() => tools.wait.upTo(60000).for(common.allExecutionsCompleted(formulaId, formulaInstanceId, 1, expectedNumSteps)))
      .then(() => common.getFormulaInstanceExecutions(formulaInstanceId))
      .then(executions => validateExecution(executions))
      .then(executions => Promise.all(executions.body.map(execution => common.getFormulaInstanceExecutionWithSteps(execution.id))))
      .then(executions => defaultValidator(executions))
      .then(executions => customValidator(executions));
  };

  it('should support a simple formula that contains a sub-formula', () => {
    const setup = () => {
      return cloud.post(`/formulas`, single(simpleFormulas, 'B-simple-formula'))
        .then(r => setProperty(simpleFormulas, 'A-simple-formula', 'A-sub-formula', r.body.id))
        .then(r => cloud.post(`/formulas`, single(simpleFormulas, 'A-simple-formula')));
    };

    return executionTest(setup, 4);
  });

  it('should support a formula having multiple sub-formulas', () => {
    const setup = () => {
      return cloud.post(`/formulas`, single(twoSubFormulas, 'C-formula'))
        .then(formula => setProperty(twoSubFormulas, 'B-formula', 'B-sub-formula', formula.body.id))
        .then(() => cloud.post(`/formulas`, single(twoSubFormulas, 'B-formula')))
        .then(formula => setProperty(twoSubFormulas, 'A-formula', ['A-sub-formula', 'A-another-sub-formula'], formula.body.id))
        .then(() => cloud.post(`/formulas`, single(twoSubFormulas, 'A-formula')));
    };

    const validator = (executions) => {
      const execution = executions[0];
      const stepExecutions = execution.stepExecutions;
      const lastStepExecution = stepExecutions.filter(se => se.stepName === 'A-end')[0];
      expect(lastStepExecution.stepExecutionValues).to.have.length(1);
      expect(lastStepExecution.stepExecutionValues[0].value).to.equal('{"b":"iamb","c":"iamc"}');
    };

    return executionTest(setup, 17, validator);
  });

  it('should support a formula multiple sub-formulas and no after steps', () => {
    const setup = () => {
      return cloud.post(`/formulas`, single(twoSubFormulasNoAfter, 'C-sub-formula-no-steps-after'))
        .then(formula => setProperty(twoSubFormulasNoAfter, 'B-sub-formula-no-steps-after', 'B-sub-formula', formula.body.id))
        .then(() => cloud.post(`/formulas`, single(twoSubFormulasNoAfter, 'B-sub-formula-no-steps-after')))
        .then(formula => setProperty(twoSubFormulasNoAfter, 'A-sub-formula-no-steps-after', 'A-sub-formula', formula.body.id))
        .then(() => cloud.post(`/formulas`, single(twoSubFormulasNoAfter, 'A-sub-formula-no-steps-after')));
    };

    return executionTest(setup, 7);
  });

  it('should support a formula with a sub-formula that has a manual trigger type', () => {
    const setup = () => {
      return cloud.post(`/formulas`, single(manualSubFormulas, 'B-manual-formula-create-resource'))
        .then(r => setProperty(manualSubFormulas, 'A-manual-formula', 'A-sub-formula', r.body.id))
        .then(r => cloud.post(`/formulas`, single(manualSubFormulas, 'A-manual-formula')));
    };

    const validator = (executions) => {
      const execution = executions[0];
      const stepExecutions = execution.stepExecutions;
      const lastStepExecution = stepExecutions.filter(se => se.stepName === 'A-end')[0];
      expect(lastStepExecution.stepExecutionValues).to.have.length(1);

      const value = lastStepExecution.stepExecutionValues[0];
      expect(value.key).to.equal('A-end.createdId');
      expect(value.value).to.be.a('string');
    };

    return executionTest(setup, 8, validator);
  });

  it('should have onSuccess or onFailure to represent the entire sub-formulas execution status', () => {
    const setup = () => {
      return cloud.post(`/formulas`, single(filterSubFormulas, 'B-filter-sub-formula'))
        .then(r => setProperty(filterSubFormulas, 'A-filter-sub-formula', 'A-sub-formula', r.body.id))
        .then(r => cloud.post(`/formulas`, single(filterSubFormulas, 'A-filter-sub-formula')));
    };

    const validator = (executions) => {
      console.log(`${executions}`);

      const stepExecutions = executions[0].stepExecutions;

      // sub-formula `filter` step should have "failed" (returned false) but the entire execution should be represented
      // as successful and then go on to run the `A-end` step successfully
      console.log(JSON.stringify(stepExecutions));
      stepExecutions.filter(se => se.stepName === 'B-filter')[0].status === 'failed';
      stepExecutions.filter(se => se.stepName === 'A-end')[0].status === 'success';
    };

    return executionTest(setup, 5, validator);
  });

  /* Cleanup any resources */
  after(() => {
    // TODO - JJW
    // return cleanFormulas()
    //   .then(r => provisioner.delete(sfdcId))
    //   .catch(e => tools.logAndThrow(`Failed to run after()`, e));
  });
});
