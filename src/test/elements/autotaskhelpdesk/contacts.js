'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const contactPayload = require('./assets/contacts');

const updatePayload = {
  "firstName": "Conan Snow",
  "lastName": "Barbarian",
  "emailAddress": "cbarb123@whatisgood.com"
};

suite.forElement('helpdesk', 'contacts', { payload: contactPayload }, (test) => {
  const build = (overrides) => Object.assign({}, contactPayload, overrides);
  const payload = build({ lastName: tools.random(), firstName: tools.random() });
  it('should create a contact and then get and update contact', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { where: 'active = 1' } }).get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${contactId}`))
      .then(r => cloud.patch(`${test.api}/${contactId}`, updatePayload));
  });
});
