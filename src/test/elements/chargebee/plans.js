'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/plans.json`);

suite.forElement('payment', 'plans', { payload: payload}, (test) => {
  test.should.supportCruds();
});
