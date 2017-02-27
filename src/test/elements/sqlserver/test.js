'use strict';

const suite = require('core/suite');
const payload = require('./assets/test');
const cloud = require('core/cloud');
const updatePayload = () => ({
    "first_name":"s"
});
suite.forElement('db', 'Test', { payload: payload }, (test) => {
  it('should allow CRUDS for test', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.contact_id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.patch(`${test.api}/${contactId}`,updatePayload()))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
