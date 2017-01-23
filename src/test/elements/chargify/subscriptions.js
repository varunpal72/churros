'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const subscriptionPayload = require('./assets/subscriptions');

suite.forElement('payment', 'subscriptions', (test) => {
  test.should.return200OnGet();
  it(`should allow GET for ${test.api}/{subscriptionId}`, () => {
    let subscriptionId;
    const updatePayload = subscriptionPayload;
    updatePayload.customer_attributes.reference = tools.random();
    return cloud.post(`${test.api}`, updatePayload)
      .then(r => subscriptionId = r.body.id)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${subscriptionId}`))
      .then(r => cloud.delete(`${test.api}/${subscriptionId}`));
  });
  test.should.supportPagination();
});
