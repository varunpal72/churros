'use strict';

const suite = require('core/suite');
const payload = require('./assets/messages');

suite.forElement('messaging', 'messages', { payload: payload }, (test) => {
  test.should.supportCrs();
});
