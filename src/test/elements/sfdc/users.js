'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');

suite.forElement('crm', 'users', payload, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
