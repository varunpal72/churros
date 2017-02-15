const payload = require('./assets/order.json');
const cloud = require('core/cloud');
const suite = require('core/suite');

suite.forElement('ecommerce', 'orders', { payload: payload}, (test) => {
  it(`should allow CRUD for ${test.api}`, () => {
    let orderid;
    return cloud.post(test.api, payload)
    .then(r => orderid = r.body.OrderID)
    .then(r => cloud.get(test.api + '/' + orderid));
  });
});
