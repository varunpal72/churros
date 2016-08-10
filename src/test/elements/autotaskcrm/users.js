'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');

suite.forElement('crm', 'users', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { where: 'userName=\'mrchurros@cloud-elements.com\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
