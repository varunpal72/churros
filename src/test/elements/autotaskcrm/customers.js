'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/customers');
const contactPayload = require('./assets/contacts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);

suite.forElement('crm', 'customers', { payload: payload }, (test) => {
  it(`should support CRUS, pagination and where for /hubs/crm/customers`, () => {
    let customerId, customerPayload;
    return cloud.post('/hubs/crm/contacts', contactPayload)
      .then(r => customerPayload = build({ userName: tools.randomEmail(), contactID: r.body.id }))
      .then(r => cloud.post(test.api, customerPayload))
      .then(r => customerId = r.body.id)
      .then(r => cloud.get(`${test.api}/${customerId}`))
      .then(r => cloud.patch(`${test.api}/${customerId}`, customerPayload))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: 'userName=\'churros@cloud-elements.com\'' } }).get(test.api));
  });
  test.should.supportNextPagePagination(1);
});
