'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const updateCharges = () => ({
  "receipt_email": tools.randomEmail()
});

suite.forElement('payment', 'charges', (test) => {
/* //Commenting out the POST of Charges as it creates a new Charge ID everytime and there is no way to delete it.
const payload = require('./assets/charges');

suite.forElement('payment', 'charges', { payload: payload }, (test) => {
  test.should.supportCrs();
  it(`should allow CU for ${test.api}`, () => {
    let chargeId;
    return cloud.post(`${test.api}`, payload)
      .then(r => chargeId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${chargeId}`,updateCharges()));
  });*/
  //let chargeId = 'ch_184F3gGdZbyQGmEed6LIMzYI'
  let chargeId;
  test.should.supportSr();
  it(`should allow Patch for ${test.api}`, () => {
    return cloud.get(`${test.api}`)
      .then(r => chargeId = r.body[0].id)
    cloud.patch(`${test.api}/${chargeId}`,updateCharges());
  });
});
