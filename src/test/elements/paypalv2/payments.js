'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/sales');
const expect = require('chakram').expect;
let options = {
  churros: {
    updatePayload: {
      "op": "replace",
      "path": "/transactions/0/item_list/shipping_address",
      "value": {
        "city": "SAn Jose",
        "country_code": "US",
        "line1": "4thFloor",
        "line2": "unit#34",
        "phone": "011862212345678",
        "postal_code": "95131",
        "recipient_name": "Hello World",
        "state": "CA"
      }
    }
  }
};

suite.forElement('payment', 'payments', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCrus();
  it.skip(`should allow C for ${test.api} and ${test.api}/:id/execute`, () => {
    let id;
    let executePayload = {
      "payer_id": "someId"
    };
    return cloud.post(test.api, payload)
      .then(r => {
        expect(r.body.payer).to.not.be.empty;
        expect(r.body.payer.payer_info).to.not.be.empty;
        expect(r.body.payer.payer_info.payer_id).to.not.be.empty;
        executePayload.payer_id = r.body.payer.payer_info.payer_id;
        id = r.body.id;
      })
      .then(r => cloud.post(`${test.api}/${id}/execute`, executePayload));
  });
  test.should.supportPagination('id');
  test
    .withName(`should support Ceql search for ${test.api} by start_time`)
    .withOptions({ qs: { where: `start_time='2016-03-06T11:00:00Z'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      let date = '2016-03-06T11:00:00Z';
      const validValues = r.body.filter(obj => obj.create_time >= date);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
