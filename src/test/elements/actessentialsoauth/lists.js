'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/lists.json`);

suite.forElement('crm', 'lists', { payload: payload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name=\'Churros Test\'' } }).should.return200OnGet();
});
