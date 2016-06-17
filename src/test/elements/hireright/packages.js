'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('screening', 'packages', (test) => {
  test.should.return200OnGet();
});
