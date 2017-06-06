'use strict';

const suite = require('core/suite');
const payload = require('core/tools').requirePayload(`${__dirname}/assets/stacks.json`);

suite.forElement('general', 'stacks', { payload: payload }, (test) => {
  test.should.supportCrds();
});
