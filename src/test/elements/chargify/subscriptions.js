'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const subscriptionPayload = tools.requirePayload(`${__dirname}/assets/subscriptions.json`);

suite.forElement('payment', 'subscriptions', { payload: subscriptionPayload }, (test) => {
  test.withOptions({ qs: { where: 'direction=\'desc\''}}).should.return200OnGet();
  test.should.supportCrds();
  test.should.supportPagination();
});
