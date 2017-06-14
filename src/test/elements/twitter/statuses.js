'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/statuses.json`);

suite.forElement('social', 'statuses', { payload: payload }, (test) => {
  test.withOptions({ qs: { where: 'q = \'Jurgen Klopp\'', page: 1, pageSize: 1 } }).should.return200OnGet();
  test.should.supportCrd();
});
