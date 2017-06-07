'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/customers');
const customerSale = require('./assets/customerSale');
const expect = require('chakram').expect;
const options = {
  churros: {
    updatePayload: {
      "op": "replace",
      "path": "/billing_address/line1",
      "value": "Some other value"
    }
  }
};

suite.forElement('payment', 'customers', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('external_customer_id');

  it('should allow POST /payments with customer ID', () => {
    let customerId, externalCustomerId;
    return cloud.post(test.api, payload)
      .then(r => {
        customerId = r.body.id; //get card ID
        externalCustomerId = r.body.external_customer_id;
        customerSale.payer.funding_instruments[0].credit_card_token.credit_card_id = customerId;  //add card info to payment object
        customerSale.payer.funding_instruments[0].credit_card_token.external_customer_id = externalCustomerId;  //add external customer ID info
      })
      .then(r => cloud.post('/payments', customerSale))
      .then(r => {
        expect(r.body.state).to.equal('approved');
        expect(r.body.transactions).to.not.be.empty;
        expect(r.body.transactions[0].related_resources).to.not.be.empty;
        expect(r.body.transactions[0].related_resources[0].sale).to.not.be.empty;
        expect(r.body.transactions[0].related_resources[0].sale.state).to.equal('completed');
      })
      .then(r => cloud.delete(`${test.api}/${customerId}`));
  });
});
