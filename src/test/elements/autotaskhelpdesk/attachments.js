'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'attachments', (test) => {
  it('should get all attachments and then get and delete attachment by attachment id', () => {
    let attachmentId;
    return cloud.get(test.api)
      .then(r => attachmentId = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${attachmentId}`))
      .then(r => cloud.withOptions({ qs: { where: 'title = attach.txt' } }).get(`${test.api}/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${attachmentId}`));
  });
});
