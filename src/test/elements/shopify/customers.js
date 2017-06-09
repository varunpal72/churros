'use strict';

const chakram = require('chakram');
const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = chakram.expect;

const customer = (custom) => ({
  first_name: custom.firstName || 'Bill',
  last_name: custom.lastName || 'Murray',
  email: custom.email || tools.randomEmail()
});

suite.forElement('ecommerce', 'customers', { payload: customer({}) }, (test) => {
  test.should.supportCruds();
  it(`should allow GET for /hubs/ecommerce/customers/{id}/order and /hubs/ecommerce/customers/{id}/abandoned-checkouts`, () => {
    let customertId;
    return cloud.post(test.api, customer({}))
      .then(r => customertId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customertId}/orders`))
      .then(r => cloud.get(`${test.api}/${customertId}/abandoned-checkouts`))
      .then(r => cloud.delete(`${test.api}/${customertId}`));
  });
  it('should allow GET for /customers with use of the `orderBy` parameter', () => {
    return cloud.withOptions({ qs: { orderBy: 'updated_at' } }).get(test.api)
      .then(r => cloud.withOptions({ qs: { orderBy: 'last_order_date' } }).get(test.api));
  });
  it('should find customer with quote in first name', () => {
    let customerId;
    let customerPayload = {
      first_name: "Churro's",
      last_name: "Test"
    };
    let query = { where: "first_name='Churro''s'" };

    return cloud.post(test.api, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.withOptions({ qs: query }).get(test.api))
      .then(r => expect(r).to.have.statusCode(200) && expect(r.body).to.not.be.null &&
        expect(r.body).to.be.a('array') && expect(r.body).to.have.length(1) &&
        expect(r.body[0]).to.contain.key('firstName') &&
        expect(r.body[0].firstName).to.equal("Churro's"))
      .then(r => cloud.delete(`${test.api}/${customerId}`));
  });
});
