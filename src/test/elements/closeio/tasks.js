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

suite.forElement('crm', 'tasks', (test) => {
  it(`should allow CRUDS for ${test.api}`, () => {
    let leadId;
    return cloud.post(`/hubs/crm/accounts`, account)
      .then(r => leadId = r.body.id)
      .then(r => cloud.cruds(test.api, task(leadId)))
      .then(r => cloud.delete(`/hubs/crm/accounts/${leadId}`));
  });
  test.should.supportPagination();
});
