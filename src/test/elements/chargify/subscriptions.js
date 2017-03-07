'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const subscriptionPayload = require('./assets/subscriptions');
subscriptionPayload.customer_attributes.reference = tools.random();

suite.forElement('payment', 'subscriptions', { payload: subscriptionPayload }, (test) => {
  test.withOptions({ qs: { where: 'direction=\'desc\''}}).should.return200OnGet();
  test.should.supportCrds();
  test.should.supportPagination();
});
