'use strict';

const suite = require('core/suite');
const payload = require('./assets/properties');

suite.forElement('marketing', 'properties', { payload: payload }, (test) => {
  test.should.return200OnPost();
});
