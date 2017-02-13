'use strict';

const suite = require('core/suite');
const payload = require('./assets/agents');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const agentsPayload = build({
  "attributes": {
    "accountLocked": true,
    "canModifyEmailSignature": true,
    "forcePasswordChange": true,
    "passwordNeverExpires": true,
    "permanentlyDisabled": true,
    "staffAssignmentDisabled": true,
    "viewsReportsDisabled": true
  },
  "login": tools.random(),
  "newPassword": tools.random() + "@Abc123",
  "name": {
    "last": tools.random(),
    "first": tools.random()
  },
  "profile": {
    "id": {
      "id": 3
    }
  },
  "staffGroup": {
    "id": {
      "id": 100395
    }
  }
});

suite.forElement('helpdesk', 'agents', { payload: agentsPayload }, (test) => {
  const updatePayload = {
    "login": tools.random()
  };

  it('should allow CRUDS for agents', () => {
    let agentID;
    return cloud.post(test.api, agentsPayload)
      .then(r => agentID = r.body.id.id)
      .then(r => cloud.get(`${test.api}/${agentID}`))
      .then(r => cloud.patch(`${test.api}/${agentID}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${agentID}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `login='Admin1'` } }).get(test.api));
  });
});
