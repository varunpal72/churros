'use strict';

const suite = require('core/suite');
const payload = require('./assets/agents');

suite.forElement('helpdesk', 'users', { payload: payload }, (test) => {
  test.should.supportSr();
});
