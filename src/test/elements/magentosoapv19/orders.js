'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'orders', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'created_at=\'2013-04-23 23:27:45\'' } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'created_at>=\'2013-04-23 23:27:45\'', pageSize: 5, page: 1 } }).should.return200OnGet();
  it.skip('should support hold & unholding an order', () => {
    let orderId = -1;
    const options = { qs: { where: 'status=\'pending\'' } };
    return cloud.withOptions(options).get(test.api)
      .then(r => orderId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${orderId}/hold`))
      .then(r => cloud.delete(`${test.api}/${orderId}/hold`));
  });
});
