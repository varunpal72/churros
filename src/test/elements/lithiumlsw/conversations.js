'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'conversations', {}, (test) => {
  it('should allow GET for /authors/:id/conversations', () => {
    let authorId;
    return cloud.withOptions({qs: {pageSize: 1}}).get('/hubs/social/authors')
      .then(r => authorId = r.body[0].handles.twitter[0].lswUuid)
      .then(r => cloud.get(`/hubs/social/authors/${authorId}/conversations`));
  });

  it('should allow GET for /conversations/:id', () => {
    let authorId;
    let conversationId;
    return cloud.withOptions({qs: {pageSize: 1}}).get('/hubs/social/authors')
      .then(r => authorId = r.body[0].handles.twitter[0].lswUuid)
      .then(r => cloud.get(`/hubs/social/authors/${authorId}/conversations`))
      .then(r => conversationId = r.body[0])
      .then(r => cloud.get(`/hubs/social/conversations/${conversationId}`));
  });

});
