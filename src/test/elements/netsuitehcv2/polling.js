'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const employeesPayload = tools.requirePayload(`${__dirname}/assets/employees.json`);

// Polling not working right now, uncomment when fixed
suite.forElement('humancapital', 'polling', {skip: true}, (test) => {
  test.withApi('/hubs/humancapital/employees').should.supportPolling(employeesPayload, 'employees');
});
