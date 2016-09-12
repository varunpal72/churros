'use strict';

const suite = require('core/suite');
const payload = require('./assets/orders');

suite.forElement('ecommerce', 'orders', { payload: payload }, (test) => {
  const ordersUpdate = () => ({
    "discount": "5"
  });
  const options = {
    churros: {
      updatePayload: ordersUpdate()
    }
  };
  test.withOptions(options).should.supportCrus();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'orderType = \'SELL_ORDER\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'orderType = \'SELL_ORDER\'' } }).should.return200OnGet();
  test.withApi(`${test.api}/valid-values`).withOptions({ qs: { fieldName: 'status' } }).should.return200OnGet();
});
