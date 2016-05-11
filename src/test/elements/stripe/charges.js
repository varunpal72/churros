'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
/* // Commented out since we are not doing POSTs
const payload = require('./assets/charges');*/

const updateCharges = () => ({
  "receipt_email": tools.randomEmail()
});

suite.forElement('payment', 'charges', (test) => {
/* //Commenting out the POST of Charges as it creates a new Charge ID everytime and there is no way to delete it.
suite.forElement('payment', 'charges', { payload: payload }, (test) => {
  test.should.supportCrs();
  it(`should allow CU for ${test.api}`, () => {
    let chargeId;
    return cloud.post(`${test.api}`, payload)
      .then(r => chargeId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${chargeId}`,updateCharges()));
  });*/
  test.should.supportSr();
  it(`should allow Patch for ${test.api}`, () => {
    let chargeId;
    return cloud.get(`${test.api}`)
      .then(r => chargeId = r.body[0].id)
      .then(r => cloud.patch(`${test.api}/${chargeId}`,updateCharges()));
  });
});
