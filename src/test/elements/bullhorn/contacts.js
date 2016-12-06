'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const contactsPayload = require('./assets/contacts');

const updatePayload = {
  "name": "John Snow",
  "firstName": "John",
  "lastName": "Snow"
};

suite.forElement('crm', 'contacts', { payload: contactsPayload }, (test) => {
  const build = (overrides) => Object.assign({}, contactsPayload, overrides);
  const payload = build({ name: tools.random, firstName: tools.random(), lastName: tools.random()});
  it('should create a contact and then get, put, delete contact by Id', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.data.id)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.put(`${test.api}/${contactId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
