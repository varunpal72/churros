'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'agents', null, (test) => {
  test.should.supportSr();
});
