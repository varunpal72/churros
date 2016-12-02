'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');

suite.forElement('marketing', 'campaigns', { payload: payload, skip: true }, (test) => {
  test.should.supportCruds();
});
