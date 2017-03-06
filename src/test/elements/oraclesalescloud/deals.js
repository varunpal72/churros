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

// This needs to be added to the assets/transformations.json file, but it currently breaks the test
// "deals": {
//   "vendorName": "deals",
//   "fields": [
//     {
//       "path": "id",
//       "vendorPath": "DealId"
//     }
//   ]
// }
// }

suite.forElement('crm', 'deals', { payload: payload }, (test) => {
  // store accountId
  let accountId = '';
  let contactId = '';
  // get valid contactId and accountId first
  before(() => cloud.post(`hubs/crm/accounts`, accountPayload)
    .then((r) => {
      payload.CustomerId = r.body.PartyId;
      accountId = r.body.id;
    })
    .then(() => cloud.post(`hubs/crm/contacts`, contactPayload))
    .then((r) => {
      payload.ContactId = r.body.PartyId;
      contactId = r.body.id;
    })
  );

  test.withOptions({skip:true}).should.supportCrus();
  test.should.supportPagination();
  test.withOptions({skip:true}).should.supportCeqlSearchForMultipleRecords('DealSize');

  // delete contact and account created for deal
  after(() => cloud.delete(`hubs/crm/accounts/${accountId}`)
    .then(() => cloud.delete(`hubs/crm/contacts/${contactId}`))
  );
});
