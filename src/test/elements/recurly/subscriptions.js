'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/subscriptions');
const plansPayload = require('./assets/plans');
const build = (overrides) => Object.assign({}, plansPayload, overrides);
const plansPayloadRandom = build({ plan_code: tools.randomInt() });

suite.forElement('billing', 'subscriptions', { payload: payload }, (test) => {
  test.should.supportNextPagePagination(2);
  test.withOptions({ qs: { where: `begin_time = '2017-04-10T16:02:04Z' and state = 'active'` } }).should.return200OnGet();
  test.withOptions({ qs: { orderBy: 'updated_at asc', pageSize: 5 } }).should.return200OnGet();

  it(`should allow CRUS for ${test.api}`, () => {
    let planId, subscriptionId;
    let updatePayload = {
      "timeframe": "now",
      "quantity": 2
    };
    return cloud.post(`/plans`, plansPayloadRandom)
      .then(r => {
        planId = r.body.id;
        payload.plan_code = planId;
      })
      .then(r => cloud.post(test.api, payload))
      .then(r => subscriptionId = r.body.id)
      .then(r => cloud.get(`${test.api}/${subscriptionId}`))
      .then(r => cloud.patch(`${test.api}/${subscriptionId}`, updatePayload))
      .then(r => cloud.get(test.api))
      .then(r => cloud.patch((`${test.api}/${subscriptionId}/cancel`)))
      .then(r => cloud.patch(`${test.api}/${subscriptionId}/reactivate`))
      .then(r => cloud.patch((`${test.api}/${subscriptionId}/cancel`)));
  });
});
