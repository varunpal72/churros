'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

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

  it('should allow GET for /changed-analytic-conversations', () => {
      let startTime = 1505422004000;
      let endTime = 1505427015008;
      let companyKey = "cesb";

      return cloud.get(`/hubs/social/changed-analytic-conversations?where=companyKey='${companyKey}' and startTime='${startTime}' and endTime='${endTime}'`)
          .then(r => expect(r).to.have.statusCode(200));
  });

    it('should allow GET for /changed-analytic-conversations/:id', () => {
        let startTime = 1505422004000;
        let endTime = 1505427015008;
        let companyKey = "cesb";
        let conversationId;

        return cloud.get(`/hubs/social/changed-analytic-conversations?where=companyKey='${companyKey}' and startTime='${startTime}' and endTime='${endTime}'`)
            .then(r => conversationId = r.body[0].displayNumber)
            .then(r => cloud.get(`/hubs/social/changed-analytic-conversations/${conversationId}`))
            .then(r => expect(r).to.have.statusCode(200));

    });
});
