'use strict';

const suite = require('core/suite');
const payload = require('./assets/agents');

suite.forElement('helpdesk', 'agents', { payload: payload }, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
