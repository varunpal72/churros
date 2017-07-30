'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('general', 'unsubscribes', (test) => {
  let messageId = null;

  it('should allow GET for hubs/general/messages/{id}/unsubscribes', () => {
    return cloud.get('hubs/general/messages')
      .then(r => {
        if (r.body && r.body.length > 0) {
          messageId = r.body[0].id;
        }
      })
      .then(r => {
        if (messageId)
          cloud.get(`hubs/general/messages/${messageId}/unsubscribes`);
      });
  });

// messageId value is being sent as 'null' here
//  test.withApi(`/hubs/general/messages/${messageId}/unsubscribes`).should.supportPagination();
});
