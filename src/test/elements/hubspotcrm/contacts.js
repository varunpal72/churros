'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const cloud = require('core/cloud');
suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.should.supportPagination();
  it('should test CRUD for contacts and get all activities', () => {
    const updatePayload =  {
      "properties": {
        "lastName": tools.random()
      }
    };
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.vid)
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.patch(`${test.api}/${contactId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
