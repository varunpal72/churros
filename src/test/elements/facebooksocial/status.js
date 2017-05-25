'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/status.json`);

suite.forElement('social', 'status', { payload:payload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
});
