'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('general', 'users', null , (test) => {
  let messageId;
  it('should test SRD users-messages', () => {
  return cloud.get(`${test.api}/me`)
   .then(r => cloud.get(`${test.api}/me/messages`))
   .then(r => messageId = r.body[0].id)
   .then(r => cloud.get(`${test.api}/me/messages/${messageId}`))
   .then(r => cloud.post(`${test.api}/me/messages/${messageId}/trash`, null));
  });

  let threadId;
  it('should test SRD users-threads', () => {
  return cloud.get(`${test.api}/me/threads`)
   .then(r => threadId = r.body[0].id)
   .then(r => cloud.get(`${test.api}/me/threads/${threadId}`))
   .then(r => cloud.post(`${test.api}/me/threads/${threadId}/trash`, null));
  });

  it('should test SU users-vacations', () => {
  return cloud.get(`${test.api}/me/vacations`)
   .then(r => cloud.patch(`${test.api}/me/vacations`, null));
  });


  test.withApi(`${test.api}/me/threads`).should.supportNextPagePagination(1);

  test.withApi(`${test.api}/me/messages`).should.supportNextPagePagination(1);
});
