'use strict';

const suite = require('core/suite');
const payload = require('./assets/slaPolicies');
const options = { payload: payload };

suite.forElement('helpdesk', 'slaPolicies', options, (test) => {
  test.should.supportCrds();
});
