'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');

suite.forElement('crm', 'lists', { payload: payload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name=\'Churros Test\'' } }).should.return200OnGet();
});
