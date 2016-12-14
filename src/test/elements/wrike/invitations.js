'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

suite.forElement('helpdesk', 'invitations', (test) => {
  it('should CRUD invitations in an account', () => {
    let accountId, invitationId;
    return cloud.get('/hubs/helpdesk/accounts')
      .then(r => accountId = r.body[0].id)
      .then(r => cloud.post(`/hubs/helpdesk/accounts/${accountId}/invitations`, { "email": tools.randomEmail()}))
      .then(r => invitationId = r.body.id)
      .then(r => cloud.get(`/hubs/helpdesk/accounts/${accountId}/invitations`))
      .then(r => cloud.put(`/hubs/helpdesk/invitations/${invitationId}`, { "role": "Collaborator" }))
      .then(r => cloud.delete(`/hubs/helpdesk/invitations/${invitationId}`));
  });
});
