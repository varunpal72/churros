'use strict';

const suite = require('core/suite');
const common = require('./assets/common');
const provisioner = require('core/provisioner');

/**
 * Tests formula executions under heavy load (number of events, size of events, etc.)
 */
suite.forPlatform('formulas', { name: 'formulas load' }, (test) => {
  let sfdcId;
  before(() => common.deleteFormulasByName(test.api, 'simple-successful')
    .then(r => common.provisionSfdcWithPolling())
    .then(r => sfdcId = r.body.id));

  /** Clean up */
  after(() => provisioner.delete(sfdcId));

  it('should handle a very large event payload', () => {
    const formula = require('./assets/simple-successful-formula');
    const formulaInstance = require('./assets/simple-successful-formula-instance');
    formulaInstance.configuration['trigger-instance'] = sfdcId;
  });
});
