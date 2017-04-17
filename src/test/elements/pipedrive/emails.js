'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('crm', 'emailThreads', { skip: true }, (test) => {

  it('should support RS for emailsThreads', () => {
    let emailThreadId;
    return cloud.get(`${test.api}`)
      .then(r => emailThreadId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${emailThreadId}/emails`))
      .then(r => cloud.get(`/hubs/crm/mailMessages/${emailThreadId}`));


  });

  it('should support RUD for mailThread', () => {

    let id;
    return cloud.withOptions({ qs: { folder: "inbox" } }).get(`/hubs/crm/mailThreads`)
      .then(r => {
        if (r.body.length <= 0) {
          return;
        }
        id = r.body[0].id;
        return cloud.get(`/hubs/crm/mailThreads/${id}`)
          .then(r => cloud.delete(`/hubs/crm/mailThreads/${id}`))
      });
  });


});
