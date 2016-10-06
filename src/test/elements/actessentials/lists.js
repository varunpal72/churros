'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');

suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name=\'Churros test group\'' } }).should.return200OnGet();
});
