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
const duplicateStepFormulas = require('./assets/formulas/sub-formula-executions/sub-formula-duplicate-step');
const twoSubFormulas = require('./assets/formulas/sub-formula-executions/two-sub-formulas');
const twoSubFormulasNoAfter = require('./assets/formulas/sub-formula-executions/two-sub-formulas-no-steps-after');
const manualSubFormulas = require('./assets/formulas/sub-formula-executions/manual-sub-formulas');
const manualSubFormulasFailedRequest = require('./assets/formulas/sub-formula-executions/manual-sub-formulas-failed-request');
const filterSubFormulas = require('./assets/formulas/sub-formula-executions/filter-sub-formulas');
const errorSubFormulas = require('./assets/formulas/sub-formula-executions/error-sub-formulas');
const event = require('./assets/events/single-event-sfdc');

suite.forPlatform('formulas', { name: 'formula executions: sub formulas' }, (test) => {
  const cleanFormulas = () => {
    const names = simpleFormulas.map(f => f.name)
      .concat(duplicateStepFormulas.map(f => f.name))
      .concat(twoSubFormulas.map(f => f.name))
      .concat(twoSubFormulasNoAfter.map(f => f.name))
      .concat(manualSubFormulas.map(f => f.name))
      .concat(manualSubFormulasFailedRequest.map(f => f.name))
      .concat(filterSubFormulas.map(f => f.name))
      .concat(errorSubFormulas.map(f => f.name));
    return cleaner.formulas.withName(names);
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
   * Creates the subFormulaName and then uses the ID of that sub-formula to create the parent formula
   */
  const createSetCreate = (formulas, subFormulaName, parentPropertyName, parentFormulaName) => {
    return cloud.post(`/formulas`, single(formulas, subFormulaName))
      .then(r => setProperty(formulas, parentFormulaName, parentPropertyName, r.body.id))
      .then(r => cloud.post(`/formulas`, single(formulas, parentFormulaName)));
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
  const executionTest = (setup, expectedNumSteps, instanceJson, customValidator, excludeDefaultValidator) => {
    if (!setup) throw Error('No setup function found.  Need a setup function that returns the formula that we should create a formula instance of');

    // default step execution validator
    customValidator = customValidator || ((executions) => logger.debug(`No validation of executions for: ${tools.stringify(executions)}`));

    const validator = (executions) => {
      if (!excludeDefaultValidator) defaultValidator(executions);
      customValidator(executions);
    };

    const fetchAndValidateExecutions = (fiId) => () => new Promise((res, rej) => {
      return common.getFormulaInstanceExecutions(fiId)
        .then(executions => validateExecution(executions))
        .then(executions => Promise.all(executions.body.map(fie => common.getFormulaInstanceExecutionWithSteps(fie.id))))
        .then(executions => validator(executions))
        .then(v => res(v))
        .catch(e => rej(e));
    });

    let formulaId, formulaInstanceId;
    return setup()
      .then(formula => formulaId = formula.body.id)
      .then(() => cloud.post(`/formulas/${formulaId}/instances`, instanceJson))
      .then(formulaInstance => formulaInstanceId = formulaInstance.body.id)
      .then(() => common.generateSfdcPollingEvent(sfdcId, event))
      .then(() => tools.wait.upTo(60000).for(common.allExecutionsCompleted(formulaId, formulaInstanceId, 1, expectedNumSteps)))
      .then(() => tools.wait.upTo(10000).for(fetchAndValidateExecutions(formulaInstanceId)));
  };

  it('should support a formula that contains a sub-formula', () => {
    const setup = () => createSetCreate(simpleFormulas, 'B-simple-formula', 'A-sub-formula', 'A-simple-formula');
    return executionTest(setup, 4, buildConfig(sfdcId));
  });

  it('should support a formula having a sub-formula with a duplicate stepName in the parent and sub-formula', () => {
    const setup = () => createSetCreate(duplicateStepFormulas, 'B-duplicate-step-sub', 'formula-b-step', 'A-duplicate-step-parent');
    return executionTest(setup, 4, buildConfig(sfdcId));
  });

  it('should support a formula having multiple sub-formulas', () => {
    const setup = () => {
      return createSetCreate(twoSubFormulas, 'C-formula', 'B-sub-formula', 'B-formula')
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

    return executionTest(setup, 17, buildConfig(sfdcId), validator);
  });

  it('should support a formula having multiple sub-formulas and no after steps', () => {
    const setup = () => {
      return createSetCreate(twoSubFormulasNoAfter, 'C-sub-formula-no-steps-after', 'B-sub-formula', 'B-sub-formula-no-steps-after')
        .then(formula => setProperty(twoSubFormulasNoAfter, 'A-sub-formula-no-steps-after', 'A-sub-formula', formula.body.id))
        .then(() => cloud.post(`/formulas`, single(twoSubFormulasNoAfter, 'A-sub-formula-no-steps-after')));
    };

    return executionTest(setup, 7, buildConfig(sfdcId));
  });

  it('should support a formula with a sub-formula that has a manual trigger type', () => {
    const setup = () => createSetCreate(manualSubFormulas, 'B-manual-formula-create-resource', 'A-sub-formula', 'A-manual-formula');

    const validator = (executions) => {
      const execution = executions[0];
      const stepExecutions = execution.stepExecutions;
      const lastStepExecution = stepExecutions.filter(se => se.stepName === 'A-end')[0];
      expect(lastStepExecution.stepExecutionValues).to.have.length(1);

      const value = lastStepExecution.stepExecutionValues[0];
      expect(value.key).to.equal('A-end.createdId');
      expect(value.value).to.be.a('string');
    };

    return executionTest(setup, 8, buildConfig(sfdcId), validator);
  });

  it('should have onSuccess or onFailure to represent the entire sub-formulas execution status', () => {
    const setup = () => createSetCreate(filterSubFormulas, 'B-filter-sub-formula', 'A-sub-formula', 'A-filter-sub-formula');

    const validator = (executions) => {
      // sub-formula `filter` step should have "failed" (returned false) but the entire execution should be represented
      // as successful and then go on to run the `A-end` step successfully
      const stepExecutions = executions[0].stepExecutions;
      stepExecutions.filter(se => se.stepName === 'A-end')[0].status === 'success';
    };

    return executionTest(setup, 5, buildConfig(sfdcId), validator, true);
  });

  it('should propagate errors from sub-formulas properly', () => {
    const setup = () => createSetCreate(errorSubFormulas, 'B-error-sub-formula', 'A-sub-formula', 'A-error-sub-formula');

    const validator = (executions) => {
      const subFormulaExecution = executions[0].stepExecutions.filter(se => se.stepName === 'A-sub-formula')[0];
      expect(subFormulaExecution.status).to.equal('failed');
      expect(subFormulaExecution.stepExecutionValues).to.have.length(1);
      expect(subFormulaExecution.stepExecutionValues[0].value).to.contain('error');
    };

    return executionTest(setup, 4, buildConfig(sfdcId), validator, true);
  });

  it('should propagate values from a sub-formula that failed but not with an error', () => {
    const setup = () => createSetCreate(manualSubFormulasFailedRequest, 'B-manual-formula-create-resource-failed-request', 'A-sub-formula', 'A-manual-formula-failed-request');

    const validator = (executions) => {
      const subFormulaExecution = executions[0].stepExecutions.filter(se => se.stepName === 'A-sub-formula')[0];
      expect(subFormulaExecution.status).to.equal('failed');

      // validate A-sub-formula sevs
      const subFormulaSevs = subFormulaExecution.stepExecutionValues;
      expect(subFormulaSevs).to.have.length(1);
      const subFormulaSevsJson = JSON.parse(subFormulaSevs[0].value);
      expect(subFormulaSevsJson.request).to.not.be.null;
      expect(subFormulaSevsJson.response).to.not.be.null;

      // validate A-end sevs
      const onFailureExecution = executions[0].stepExecutions.filter(se => se.stepName === 'A-end')[0];

      const endSevs = onFailureExecution.stepExecutionValues;
      expect(endSevs).to.have.length(1);
      const endSevsJson = JSON.parse(endSevs[0].value);
      expect(endSevsJson.code).to.equal(404);
      expect(endSevsJson.headers).to.not.be.null;
      expect(endSevsJson.body).to.not.be.null;
    };

    return executionTest(setup, 5, buildConfig(sfdcId), validator, true);
  });

  it('should support passing configs to a sub-formula with different keys than parent configs', () => {
    const setup = () => createSetCreate(simpleFormulas, 'child-accepts-configs', 'subformula', 'parent-passes-conifigs');

    const instance = { name: 'parent instance', configuration: { 'crm.instance': sfdcId, parent: 'parent', 'over.ride.test': 'parent' } };

    const validator = (executions) => {
      const execution = executions[0];
      const stepExecutions = execution.stepExecutions;
      const subStepExecution = stepExecutions.filter(se => se.stepName === 'subformula')[0];
      const subSEVsJson = JSON.parse(subStepExecution.stepExecutionValues[0].value);
      expect(subSEVsJson.parent).to.equal('parent');
      expect(subSEVsJson.overRideConfig).to.equal('child');
      expect(subSEVsJson.child).to.equal('child');

      const lastStepExecution = stepExecutions.filter(se => se.stepName === 'last')[0];
      const lastSEVsJson = JSON.parse(lastStepExecution.stepExecutionValues[0].value);
      expect(lastSEVsJson.parent).to.equal('parent');
      expect(lastSEVsJson.overRideConfig).to.equal('parent');
    };

    return executionTest(setup, 5, instance, validator);
  });

  it('should support passing configs to a sub-formula with same keys as parent and not override', () => {

    const setup = () => {
      return createSetCreate(simpleFormulas, 'child3', 'subformula2', 'child2')
        .then(formula => setProperty(simpleFormulas, 'child1', ['subformula1'], formula.body.id))
        .then(() => cloud.post(`/formulas`, single(simpleFormulas, 'child1')))
        .then(formula => setProperty(simpleFormulas, 'parent', ['subformula'], formula.body.id))
        .then(() => cloud.post(`/formulas`, single(simpleFormulas, 'parent')));
    };

    const instance = { name: 'parent instance', configuration: { 'crm.instance': sfdcId, 'over.ride.test': 'parent' } };

    const validator = (executions) => {
      const execution = executions[0];
      const stepExecutions = execution.stepExecutions;

      const lastStepExecution = stepExecutions.filter(se => se.stepName === 'last')[0];
      const lastSEVsJson = JSON.parse(lastStepExecution.stepExecutionValues[0].value);
      expect(lastSEVsJson.over).to.equal('parent');
      expect(lastSEVsJson.child1.over).to.equal('child1');
      expect(lastSEVsJson.child1.child1).to.equal('child1');
      expect(lastSEVsJson.child1.child2.over).to.equal('child2');
      expect(lastSEVsJson.child1.child2.child3.over).to.equal('child3');
    };

    return executionTest(setup, 11, instance, validator);
  });

  /* Cleanup any resources */
  after(() => {
    return cleanFormulas()
      .then(r => provisioner.delete(sfdcId))
      .catch(e => tools.logAndThrow(`Failed to run after()`, e)) ;
  });
});
