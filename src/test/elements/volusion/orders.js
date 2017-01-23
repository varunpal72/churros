'use strict';

const suite = require('core/suite');
const payload = require('./assets/orders');
const cloud = require('core/cloud');
const tools = require('core/tools');

suite.forElement('ecommerce', 'orders', { payload: payload }, (test) => {

  it(`should support CRUDS for ${test.api}`, () => {
    let orderID;
    return cloud.post(test.api, payload)
      .then(r => orderID = r.body.OrderID)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `OrderDateUtc='1/23/2017'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${orderID}`));
  });
});
