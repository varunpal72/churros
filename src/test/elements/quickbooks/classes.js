'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'classes', {skip: false}, (test) => {
  test.should.supportSr();
});
