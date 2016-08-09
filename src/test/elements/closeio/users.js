'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const account = require('./assets/account');

const task = (leadId) => ({
  "text": "Connect with Account Manager",
  "date": "2013-02-06",
  "is_complete": false,
  "lead": leadId
});
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

suite.forElement('crm', 'users', { payload: task }, (test) => {
  it(`should allow GET for ${test.api}/{id}`, () => {
    let leadId, opportunityId, userId;
    return cloud.post(`/hubs/crm/accounts`, account)
      .then(r => leadId = r.body.id)
      .then(r => cloud.post(`/hubs/crm/opportunities`, opportunity(leadId)))
      .then(r => opportunityId = r.body.id)
      .then(r => cloud.get(`/hubs/crm/opportunities/${opportunityId}`))
      .then(r => userId = r.body.user_id)
      .then(r => cloud.get(`${test.api}/${userId}`))
      .then(r => cloud.delete(`/hubs/crm/opportunities/${opportunityId}`))
      .then(r => cloud.delete(`/hubs/crm/accounts/${leadId}`));
  });
});
