'use strict';

const suite = require('core/suite');
const payload = require('./assets/orders');

suite.forElement('ecommerce', 'orders', { payload: payload, skip: true }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "discount": "5"
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'orderType = \'SELL_ORDER\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'orderType = \'SELL_ORDER\'' } }).should.return200OnGet();
  test.withApi(`${test.api}/valid-values`).withOptions({ qs: { fieldName: 'status' } }).should.return200OnGet();
});
