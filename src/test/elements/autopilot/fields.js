'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

const contactPayload = (email) => ({
  "FirstName": "Mr.",
  "LastName": "Churro",
  "Email": email
});

const fieldsPayload = () => ({
  "string--key": "value"
});

suite.forElement('marketing', 'fields', { skip: true }, (test) => {
  test.should.return200OnGet();
  it('should allow C for /hubs/marketing/contacts/{email}/fields', () => {
    let email = tools.randomEmail().toString();
    let contactId = -1;
    return cloud.post('/hubs/marketing/contacts', contactPayload(email))
      .then(r => contactId = r.body.id)
      .then(r => cloud.post(`/hubs/marketing/contacts/${email}/fields`, fieldsPayload()))
      .then(r => cloud.delete(`/hubs/marketing/contacts/${contactId}`));
  });
});
