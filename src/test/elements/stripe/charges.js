'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/charges');

const updateCharges = () => ({
  "receipt_email": tools.randomEmail()
});

suite.forElement('payment', 'charges', { payload: payload }, (test) => {
  test.should.supportCrs();
  it(`should allow CUS for ${test.api}`, () => {
    let chargeId;
    return cloud.post(test.api, payload)
      .then(r => chargeId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${chargeId}`, updateCharges()))
      .then(r => cloud.post(`${test.api}/${chargeId}/capture`))
      .then(r => cloud.withOptions({ qs: { where: `currency='usd' and  created=1485255289` } }).get(test.api));
  });
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
});
