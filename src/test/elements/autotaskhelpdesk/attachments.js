'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'attachments', (test) => {
  it(`should support paging, Ceql search and SRD for ${test.api}`, () => {
    let attachmentId;
    return cloud.get(test.api)
      .then(r => attachmentId = r.body[0].id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: 'title = attach.txt' } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${attachmentId}`));
  });
});
