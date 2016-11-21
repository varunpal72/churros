'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');

suite.forElement('marketing', 'accounts', { payload: payload }, (test) => {
  test.should.supportCrud();
});
