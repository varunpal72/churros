'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {
  test.should.supportCrus();
});
