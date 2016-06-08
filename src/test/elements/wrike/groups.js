'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'groups', (test) => {
  it('should CRUD for account groups', () => {
    let accountId, groupId;
    return cloud.get('/hubs/helpdesk/accounts')
      .then(r => accountId = r.body[0].id)
      .then(r => cloud.post(`/hubs/helpdesk/accounts/${accountId}/groups`, { "title": "Test Group" }))
      .then(r => groupId = r.body.id)
      .then(r => cloud.get('/hubs/helpdesk/groups/' + groupId))
      .then(r => cloud.get(`/hubs/helpdesk/accounts/${accountId}/groups`))
      .then(r => cloud.put(`/hubs/helpdesk/groups/${groupId}`, { "title": "update group title" }))
      .then(r => cloud.delete('/hubs/helpdesk/groups/' + groupId));
  });
});
