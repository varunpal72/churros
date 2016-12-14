'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');


suite.forElement('crm', 'users', { payload: payload, skip: true }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
