'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const cloud = require('core/cloud');
var contactsId = 396139;
suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.should.supportPagination();
  it('should test CRUD for /contacts and GET /contacts/{id}/activities', () => {
    const updatePayload = {
      "properties": {
        "lastName": tools.random()
      }
    };
    let contactId;
    const options = { qs: { pageSize: 1 } };
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.withOptions(options).get(`${test.api}/${contactId}/activities`))
      .then(r => options.qs.nextPage = r.response.headers['elements-next-page-token'])
      .then(r => cloud.withOptions(options).get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.patch(`${test.api}/${contactId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});

suite.forElement('crm', `contacts/${contactsId}/activities`, { payload: payload }, (test) => {
  test.should.supportNextPagePagination(1);
}); 
