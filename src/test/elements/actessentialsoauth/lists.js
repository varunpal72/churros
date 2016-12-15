'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/lists');

payload.name += tools.randomStr('abcdefghijklmnopqrstuvwxyz', 10);

suite.forElement('crm', 'lists', { payload: payload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name=\'Churros Test\'' } }).should.return200OnGet();
});
