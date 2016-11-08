'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const account = require('./assets/account');

const opportunity = (leadId) => ({
  "name": "Test Company",
  "url": "http://thetestcompany.tumblr.com/",
  "description": "Best. Show. Ever.",
  "contacts": [
    {
      "name": "Gob",
      "title": "Sr. Vice President",
      "emails": [
        {
          "type": "office",
          "email": "gob@example.com"
        }
      ],
      "phones": [
        {
          "type": "office",
          "phone": "+8004445555"
        }
      ]
    }
  ],
  "addresses": [
    {
      "label": "business",
      "address_1": "747 Howard St",
      "address_2": "Room 3",
      "city": "San Francisco",
      "state": "CA",
      "zipcode": "94103",
      "country": "US"
    }
  ],
  "lead": leadId
});

suite.forElement('crm', 'opportunities', (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    let leadId;
    return cloud.post(`/hubs/crm/accounts`, account)
      .then(r => leadId = r.body.id)
      .then(r => cloud.cruds(test.api, opportunity(leadId)))
      .then(r => cloud.delete(`/hubs/crm/accounts/${leadId}`));
  });
  test.should.supportPagination();
});
