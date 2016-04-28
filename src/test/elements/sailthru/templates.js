'use strict';

const suite = require('core/suite');
const payload = require('./assets/templates');

suite.forElement('marketing', 'templates', { payload: payload }, (test) => {
  test.should.return200OnPost();
});
