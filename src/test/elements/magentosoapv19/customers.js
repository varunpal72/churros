'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const cloud = require('core/cloud');
const tools = require('core/tools');

payload.email = tools.randomEmail();

const updatePayload = (randomEmail) => ({
  "email": randomEmail,
  "firstname": "Mister",
  "lastname": "churros"
});

suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  it('should support CRUS', () => {
    let customerId = -1;
    const options = { qs: { where: 'lastname=\'churros\'' } };
    return cloud.post(test.api, payload)
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customerId}`))
      .then(r => cloud.patch(`${test.api}/${customerId}`, updatePayload(tools.randomEmail())))
      .then(r => cloud.withOptions(options).get(test.api));
  });
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'created_at=\'2013-04-24 11:19:25\'' } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'created_at>=\'2013-04-24 11:19:25\'', pageSize: 5, page: 1 } }).should.return200OnGet();

});
