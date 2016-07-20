'use strict';

const suite = require('core/suite');
const payload = require('./assets/recorded-events');

suite.forElement('marketing', 'recorded-events', { payload: payload }, (test) => {
  test.should.return200OnPost();
});
