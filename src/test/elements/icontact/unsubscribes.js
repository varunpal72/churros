'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

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

  it('should allow paginating with page and pageSize for hubs/general/messages/{id}/unsubscribes', () => {
    return cloud.withOptions({ qs: { page: 1, pageSize: 4 } }).get(`hubs/general/messages/${messageId}/unsubscribes`)
      .then(r => expect(r.body.length).to.be.below(4))
      .then(r => cloud.withOptions({ qs: { page: 2, pageSize: 3} }).get(`hubs/general/messages/${messageId}/unsubscribes`))
      .then(r => expect(r.body.length).to.be.below(3));
  });
});
