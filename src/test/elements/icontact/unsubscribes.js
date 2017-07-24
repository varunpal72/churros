'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('general', 'messages', (test) => {

  it('should allow GET for hubs/general/messages/{id}/unsubscribes', () => {
    let messageId=null;
    return cloud.get('hubs/general/messages')
      .then(r => {
        if (r.body && r.body.length > 0) {
          messageId = r.body[0].messageId;
        }
      })
      .then(r => {
        if(messageId)
        cloud.get(`${test.api}/${messageId}/unsubscribes`);
    });
  });
  test.should.supportPagination();
});
