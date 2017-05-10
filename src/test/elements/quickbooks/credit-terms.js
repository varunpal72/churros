'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/credit-terms.json`);

suite.forElement('finance', 'credit-terms', { payload: payload }, (test) => {
  test.should.supportCrs();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
});
