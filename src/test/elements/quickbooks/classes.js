'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'classes', null, (test) => {
  test.should.supportSr();
});
