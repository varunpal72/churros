'use strict';

const suite = require('core/suite');
const payload = require('./assets/optouts');

suite.forElement('marketing', 'optouts', { payload: payload }, (test) => {
  test.should.return200OnGet();
});
