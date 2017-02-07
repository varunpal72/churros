'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const contactPayload = require('./assets/contacts.json');
const accountPayload = require('./assets/accounts.json');
const payload = {
  "CloseDate": "2017-09-30",     // close date must be in future
  "ContactId":300000000787157,   // contactId must be valid contact "PartyId"
  "CustomerId":300000000786253,  // customerId must be valid account "PartyId"
  "DealSize":1100,
  "DealType": "ORA_EXISTING"
};

suite.forElement('crm', 'deals', { payload: payload }, (test) => {
  // get valid contactId and accountId first
  before(() => cloud.post(`hubs/crm/accounts`, accountPayload)
    .then(r => payload.CustomerId = r.body.PartyId)
    .then(() => cloud.post(`hubs/crm/contacts`, contactPayload))
    .then(r => payload.ContactId = r.body.PartyId)
  );

  test.withOptions({skip:false}).should.supportCrus();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('DealSize');

  // delete contact and account created for deal
  after(() => cloud.delete(`hubs/crm/accounts/${payload.CustomerId}`)
    .then(() => cloud.delete(`hubs/crm/contacts/${payload.ContactId}`))
  );
});
