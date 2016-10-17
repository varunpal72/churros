'use strict';

const suite = require('core/suite');
const payload = require('./assets/background-check-links');

suite.forElement('screening', 'background-check-links', { payload: payload }, (test) => {
  test.should.return200OnPost();
});
