'use strict';

const suite = require('core/suite');
const payload = require('./assets/stacks');

suite.forElement('general', 'stacks', { payload: payload }, (test) => {
  test.should.supportCrds();
});
