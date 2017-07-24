'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/messages.json`);

suite.forElement('general', 'messages', (test) => {

  it('should allow GET for hubs/general/messages/{id}/unsubscribes', () => {
    let messageId=null, campaignId;
    return cloud.get('hubs/general/messages')
      .then(r => {
        if (r.body && r.body.length > 0) {
          messageId = r.body[0].messageId;
        }
      })
      .then(r => {
        if(messageId)
        cloud.get(`${test.api}/${messageId}/unsubscribes`)
    });
  });
  test.should.supportPagination();
});
