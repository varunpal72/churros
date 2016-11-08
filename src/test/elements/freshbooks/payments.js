'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const payload = (id) => ({
  "type": "Credit",
  "client_id": id,
  "amount": 15.0,
  "notes": "Client credit"
});

suite.forElement('finance', 'payments', { payload: payload() }, (test) => {
  it('should allow CRUDS for ' + test.api, () => {
    let customerId;
    return cloud.post('/hubs/finance/customers', { first_name: 'churros', last_name: 'tmp', email: 'random@churros.com' })
      .then(r => customerId = r.body.id)
      .then(r => cloud.cruds(test.api, payload(customerId)))
      .then(r => cloud.delete(`/hubs/finance/customers/${customerId}`));
  });
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'updated_from =\'2016-05-15\'' } }).should.return200OnGet();
});