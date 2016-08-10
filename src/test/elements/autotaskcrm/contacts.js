'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { where: 'lastName=\'Churros\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
