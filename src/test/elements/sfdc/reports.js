'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/reports.json`);

suite.forElement('crm', 'reports', { payload: payload }, (test) => {
  test.should.supportCrds();
  test.should.return404OnGet('0');
});
