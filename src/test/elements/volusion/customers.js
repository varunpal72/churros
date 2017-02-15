const payload = require('./assets/customer.json');
const cloud = require('core/cloud');
const suite = require('core/suite');

suite.forElement('ecommerce', 'customers', { payload: payload}, (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    let customerid;
    return cloud.post(test.api, payload)
    .then(r => customerid = r.body.CustomerID)
    .then(r => cloud.get(test.api + '/' + customerid))
    .then(r => cloud.patch(test.api + '/' + customerid, payload))
    .then(r => cloud.delete(test.api + '/' + customerid));

  });
});
