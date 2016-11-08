'use strict';

const suite = require('core/suite');
const payload = require('./assets/triggers');

suite.forElement('marketing', 'triggers', { skip: true, payload: payload }, (test) => {
  test.should.return200OnPost();
});
