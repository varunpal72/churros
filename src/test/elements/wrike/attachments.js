'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'attachments', (test) => {
  it('should allow GET for attachments', () => {
    let attachmentId;
    return cloud.get(`/hubs/helpdesk/accounts`)
      .then(r => cloud.get(`/hubs/helpdesk/accounts/${r.body[0].id}/attachments`))
      .then(r => attachmentId = r.body[0].id)
      .then(r => cloud.get(`/hubs/helpdesk/attachments/${attachmentId}`))
      .then(r => cloud.get(`/hubs/helpdesk/attachments/${attachmentId}/url`));
  });
});
