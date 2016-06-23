'use strict';

const cleaner = require('core/cleaner');
const cloud = require('core/cloud');
const suite = require('core/suite');
const provisioner = require('core/provisioner');
const tools = require('core/tools');

/* Formula JSON */
const formulas = require('./assets/formulas/sub-formula-executions/sub-formulas');
const myFormulas = require('./assets/formulas/sub-formula-executions/sub-formulas-no-steps-after');

suite.forPlatform('formulas', { name: 'formula executions: sub formulas' }, (test) => {
  const cleanFormulas = () => {
    return cleaner.formulas.withNames(formulas.map(f => f.name))
      .then(r => cleaner.formulas.withNames(myFormulas.map(f => f.name)));
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

  const buildConfig = (triggerId) => ({ name: 'churros-instance', configuration: { 'trigger-instance': triggerId } });

  const setProperty = (allFormulas, formulaName, stepNames, value) => {
    if (typeof stepNames === 'string') stepNames = [stepNames];

    stepNames.map(stepName =>
      allFormulas.filter(f => f.name === formulaName)[0]
      .steps.filter(step => step.name === stepName)[0]
      .properties.formulaId = value
    );
  };

  it('should support a formula having a formula step type', () => {
    let formulaId;
    const setup = () => {
      return cloud.post(`/formulas`, formulas[2])
        .then(r => setProperty(formulas, 'B-sub-formula', 'B-sub-formula', r.body.id))
        .then(r => cloud.post(`/formulas`, formulas[1]))
        .then(r => setProperty(formulas, 'A-sub-formula', ['A-sub-formula', 'A-another-sub-formula'], r.body.id))
        .then(r => cloud.post(`/formulas`, formulas[0]))
        .then(r => formulaId = r.body.id);
    };

    return setup()
      .then(r => cloud.post(`/formulas/${formulaId}/instances`, buildConfig(sfdcId)));
  });

  it('should support a formula with multiple sub-formulas and no after steps', () => {
    let formulaId;
    const setup = () => {
      return cloud.post(`/formulas`, myFormulas[2])
        .then(r => setProperty(myFormulas, 'B-sub-formula-no-steps-after', 'B-sub-formula', r.body.id))
        .then(r => cloud.post(`/formulas`, myFormulas[1]))
        .then(r => setProperty(myFormulas, 'A-sub-formula-no-steps-after', 'A-sub-formula', r.body.id))
        .then(r => cloud.post(`/formulas`, myFormulas[0]))
        .then(r => formulaId = r.body.id);
    };

    return setup()
      .then(r => cloud.post(`/formulas/${formulaId}/instances`, buildConfig(sfdcId)));
  });

  /* Cleanup any resources */
  after(() => {
    return cleanFormulas()
      .then(r => provisioner.delete(sfdcId))
      .catch(e => tools.logAndThrow(`Failed to run after()`, e));
  });
});
