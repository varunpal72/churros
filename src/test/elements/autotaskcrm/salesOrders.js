'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('crm', 'sales-orders', (test) => {
  test.should.supportSr();
  it('should allow PATCH on ' + test.api + '/{id}', () => {
    let oldAddress = "";
    let testAddress = "999 Churros Ave";
    let pass = false;
    return cloud.get(test.api)
      .then(r => r.body[0])
      .then(order => {
        if (order.shipToAddress1){
          oldAddress = order.shipToAddress1;
        }
        return cloud.patch(`${test.api}/${order.id}`, {"shipToAddress1": testAddress});
      })
      .then(r => r.body)
      .then(updatedOrder => {
        if (updatedOrder.shipToAddress1 === testAddress){
          pass = true;
        }
        cloud.patch(`${test.api}/${updatedOrder.id}`, {"shipToAddress1": oldAddress});
        return pass;
      });
  });
  test.withOptions({ qs: { where: 'billToCountry=\'United States\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
