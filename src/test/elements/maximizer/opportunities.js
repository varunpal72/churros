'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const opportunityPayload = require('./assets/opportunities');

suite.forElement('crm', 'opportunities', (test) => {
  test.should.supportPagination('id');
  it('should allow CRUDS for /contacts', () => {
    let opportunityId;
    return cloud.get(`/hubs/crm/addressbook-entries`)
      .then(r => opportunityPayload.AbEntryKey = r.body[0].id)
      .then(r => cloud.post(test.api, opportunityPayload))
      .then(r => opportunityId = r.body.Key)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${opportunityId}`))
      .then(r => cloud.patch(`${test.api}/${opportunityId}`, opportunityPayload))
      .then(r => cloud.delete(`${test.api}/${opportunityId}`));
  });
});
