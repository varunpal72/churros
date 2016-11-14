'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/charges');

const updateCharges = () => ({
  "receipt_email": tools.randomEmail()
});

suite.forElement('payment', 'charges', { payload: payload, skip: true }, (test) => {
  test.should.supportCrs();
  it(`should allow CU for ${test.api}`, () => {
    let chargeId;
    return cloud.post(`${test.api}`, payload)
      .then(r => chargeId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${chargeId}`,updateCharges()));
  });
  test.should.supportSr();
  it(`should allow Patch for ${test.api}`, () => {
    let chargeId;
    return cloud.get(`${test.api}`)
      .then(r => chargeId = r.body[0].id)
      .then(r => cloud.patch(`${test.api}/${chargeId}`,updateCharges()));
  });
});
