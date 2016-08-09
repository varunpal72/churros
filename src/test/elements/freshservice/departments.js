'use strict';

const suite = require('core/suite');
const payload = require('./assets/departments');
const tools = require('core/tools');
payload.name = tools.random();

suite.forElement('helpdesk', 'departments', { payload: payload }, (test) => {
  test.should.supportCruds();
});
