'use strict';

const suite = require('core/suite');
const payload = require('./assets/tasks');

suite.forElement('crm', 'tasks', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
