'use strict';

const suite = require('core/suite');
const payload = require('./assets/tasks');

suite.forElement('crm', 'tasks', { payload: payload, skip: true }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
