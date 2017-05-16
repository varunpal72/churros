'use strict';

const suite = require('core/suite');
const payload = require('./assets/orders');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('ecommerce', 'orders', { payload: payload}, (test) => {
  let date;
  test.should.supportSr();

  it.skip('it should support PATCH', () => {  //since no post for orders, patch is skipped
    return cloud.get('/hubs/ecommerce/orders')
      .then(r => r.body.filter(r => r.id))
      .then(filteredOrders => cloud.patch(`/hubs/ecommerce/orders/${filteredOrders[0].id}`, payload));
  });

  it('it should support GET payments by order id', () => {
    return cloud.get('/hubs/ecommerce/orders')
      .then(r => r.body.filter(r => r.id))
      .then(filteredOrders => cloud.get(`/hubs/ecommerce/orders/${filteredOrders[0].id}/payments`));
  });

  it('it should support GET refunds by order id', () => {
    return cloud.get('/hubs/ecommerce/orders')
      .then(r => r.body.filter(r => r.id))
      .then(filteredOrders => cloud.get(`/hubs/ecommerce/orders/${filteredOrders[0].id}/refunds`));
  });

  test
    .withName(`should support searching ${test.api} by created date`)
    .withOptions({ qs: { where: `date = '2017-03-22 16:22:25'` } }) //Since no delete for orders, so directly using value
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.created === '2017-03-22 16:22:25');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

    test.should.supportPagination();

    test
    .withApi(`${test.api}/40/payments`)
    .withOptions({ qs: { page : 1, pageSize: 1 } })
     .should.return200OnGet();

     test
     .withApi(`${test.api}/5/refunds`)
     .withOptions({ qs: { page : 1, pageSize: 1 } })
      .should.return200OnGet();
});
