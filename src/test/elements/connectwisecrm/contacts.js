'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { where: 'email=\'churros@connectWise.com\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
