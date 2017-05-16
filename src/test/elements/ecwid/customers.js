'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('ecommerce', 'customers', (test) => {
  let id;
  test.should.return200OnGet();

  it('it should support GET by id', () => {
    return cloud.get(test.api)
      .then(r => r.body.filter(r => r.id))
      .then(filteredCustomers => cloud.get(`${test.api}/${filteredCustomers[0].id}`));
  });

  it('it should support GET orders by customer id', () => {
    return cloud.get(test.api)
      .then(r => r.body.filter(r => r.id))
      .then(filteredCustomers => cloud.get(`${test.api}/${filteredCustomers[0].id}/orders`));
  });

  it('should support GET ${test.api}', () => {
    return cloud.get(test.api)
      .then(r => id = r.body[0].id);
  });

  test
    .withName(`should support searching ${test.api} by customer_id`)
    .withOptions({ qs: { where: 'customer_id=35738262' } }) //Since no delete for customer, so directly using value
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.id === id);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

  test.should.supportPagination();

  test
    .withApi(`${test.api}/35738262/orders`)
    .should.supportPagination();
});
