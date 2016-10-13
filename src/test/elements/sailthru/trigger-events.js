'use strict';

const suite = require('core/suite');
const payload = require('./assets/trigger-events');

suite.forElement('marketing', 'trigger-events/fire', { skip: true, payload: payload }, (test) => {
  test.should.return200OnPost();
});
