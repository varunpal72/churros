'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'attachments', null, (test) => {
  it('should create read, delete attachments', () => {
    let attachmentId;
    let query = { fileName: "attach.txt" };
    return cloud.withOptions({ qs: query }).postFile(`${test.api}`, __dirname + '/assets/attach.txt')
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get(`${test.api}/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${attachmentId}`));
  });
});
