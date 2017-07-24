'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'campaigns', (test) => {
  test.should.supportSr();
});
