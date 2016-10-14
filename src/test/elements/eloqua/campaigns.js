'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');

suite.forElement('marketing', 'campaigns', { payload: payload }, (test) => {
  // can't create so don't run this everytime
  test.withOptions({ skip: true }).should.return200OnGet();
});
