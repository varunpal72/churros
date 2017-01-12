'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'orders', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'created_at=\'2013-04-23 23:27:45\'' } }).should.return200OnGet();
  it.skip('should support GET invoice,shipments,hold, unholding and POST credit-memos an order', () => {
    let orderId = -1;
     const payload = {};
    const options = { qs: { where: 'status=\'pending\'' } };
    return cloud.withOptions(options).get(test.api)
      .then(r => orderId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${orderId}/hold`))
      .then(r => cloud.delete(`${test.api}/${orderId}/hold`))
      .then(r=> cloud.post(`${test.api}/${orderId}/invoices`,payload))
      .then(r=> cloud.post(`${test.api}/${orderId}/shipments`,payload))
      .then(r=> cloud.withOptions({ qs: { where: 'status=\'complete\'' } }).get(test.api))
      .then(r => orderId = r.body[0].id)
      .then(r=> cloud.post(`${test.api}/${orderId}/credit-memos`,payload));

  });
});
