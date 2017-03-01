'use strict';

const suite = require('core/suite');
const payload = require('./assets/paymentMethod');
const customerPayload = require('./assets/customers');
const tools = require('core/tools');
const chakram = require('chakram');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const paymentPayload = build({ CreditCardAddress1: tools.random() });
suite.forElement('payment', 'payment-methods', { payload: paymentPayload }, (test) => {
  let customerId;
  const options = {
    churros: {
      updatePayload: {
        "CreditCardAddress1": tools.random()
      }
    }
  };
  const ceqlOptions = {
    name: "'should support CreatedDate > {date} Ceql search'",
    qs: { where: 'CreatedDate>\'2017-02-22T08:21:00.000Z\'' }
  };
  before(() => {
    cloud.post(`/hubs/payment/customers`, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => paymentPayload.AccountId = customerId);
  });
  test.should.supportNextPagePagination(2);
  test.withOptions(ceqlOptions).should.return200OnGet();
  test.withOptions(options).should.supportCruds(chakram.put);
  after(() => cloud.delete(`/hubs/payment/customers/${customerId}`));
});
