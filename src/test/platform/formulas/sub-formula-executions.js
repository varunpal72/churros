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
const event = require('./assets/events/single-event-sfdc');

suite.forPlatform('formulas', { name: 'formula executions: sub formulas' }, (test) => {
  const cleanFormulas = () => {
    const names = simpleFormulas.map(f => f.name)
      .concat(twoSubFormulas.map(f => f.name))
      .concat(twoSubFormulasNoAfter.map(f => f.name))
      .concat(manualSubFormulas.map(f => f.name));
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

  const successfulValidation = (executions) => {
    expect(executions).to.have.length(1);
    const execution = executions[0];
    expect(execution.status).to.equal('success');
    const stepExecutions = execution.stepExecutions;
    expect(stepExecutions.filter(se => se.status !== 'success')).to.have.length(0);
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
  const executionTest = (setup, expectedNumSteps, executionValidator) => {
    if (!setup) throw Error('No setup function found.  Need a setup function that returns the formula that we should create a formula instance of');

    // default step execution validator
    executionValidator = executionValidator || ((executions) => logger.debug(`No validation of executions for: ${tools.stringify(executions)}`));

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
      .then(executions => executionValidator(executions));
  };

  it('should support a simple formula that contains a sub-formula', () => {
    const setup = () => {
      return cloud.post(`/formulas`, single(simpleFormulas, 'B-simple-formula'))
        .then(r => setProperty(simpleFormulas, 'A-simple-formula', 'A-sub-formula', r.body.id))
        .then(r => cloud.post(`/formulas`, single(simpleFormulas, 'A-simple-formula')));
    };

    const validator = (executions) => {
      successfulValidation(executions);
    };

    return executionTest(setup, 4, validator);
  });

  it('should support a formula having multiple sub-formulas', () => {
    const setup = () => {
      return cloud.post(`/formulas`, single(twoSubFormulas, 'C-formula'))
        .then(formula => setProperty(twoSubFormulas, 'B-formula', 'B-sub-formula', formula.body.id))
        .then(() => cloud.post(`/formulas`, single(twoSubFormulas, 'B-formula')))
        .then(formula => setProperty(twoSubFormulas, 'A-formula', ['A-sub-formula', 'A-another-sub-formula'], formula.body.id))
        .then(() => cloud.post(`/formulas`, single(twoSubFormulas, 'A-formula')));
    };

    return executionTest(setup, 17);
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
      successfulValidation(executions);
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

  /* Cleanup any resources */
  after(() => {
    // TODO - JJW
    // return cleanFormulas()
    //   .then(r => provisioner.delete(sfdcId))
    //   .catch(e => tools.logAndThrow(`Failed to run after()`, e));
  });
});
