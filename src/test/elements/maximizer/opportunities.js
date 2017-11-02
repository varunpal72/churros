'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const opportunityPayload = () => ({
  "Description":"opportunity1"
});

suite.forElement('crm', 'opportunities', (test) => {
  test.should.supportPagination('id');
  let parentId, opportunityId, req;
  it('should allow CRUDS for /contacts', () => {
    return cloud.get(`/hubs/crm/addressbook-entries`)
      .then(r => parentId = r.body[0].id)
      .then(r => req = opportunityPayload())
      .then(r => req.AbEntryKey = parentId)
      .then(r => cloud.post(`${test.api}`, req))
      .then(r => cloud.get(`${test.api}`))
      .then(r => opportunityId = r.body[0].Key)
      .then(r => cloud.get(`${test.api}/${opportunityId}`))
      .then(r => cloud.patch(`${test.api}/${opportunityId}`, {}))
      .then(r => cloud.delete(`${test.api}/${opportunityId}`));
  });
});
