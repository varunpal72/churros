'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('payment', 'subscriptions', (test) => {
  test.should.return200OnGet();
  it(`should allow GET for ${test.api}/{subscriptionId}`, () => {
    let subscriptionId;
    return cloud.get(`${test.api}`)
      .then(r => subscriptionId = r.body[0].subscription.id)
      .then(r => cloud.get(`${test.api}/${subscriptionId}`));
  });
  test.should.supportPagination();
});
