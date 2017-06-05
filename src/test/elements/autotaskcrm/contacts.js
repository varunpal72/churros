'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { where: 'lastName=\'Churros\'' } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'lastActivityDate > \'2012-05-25T11:13:29-0500\' and  (lastName = \'Eckle\' or lastName = \'Schrage\') ' } }).should.return200OnGet();
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
});
