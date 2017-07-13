'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('marketing', 'channels', null, (test) => {
  let channelId;
  it(`should support GET, pagination and Ceql search for ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => channelId = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `id='${channelId}'` } }).get(test.api));
  });

  it(`should support GET, pagination and Ceql search for ${test.api}/:channelId/activities`, () => {
    let id;
    return cloud.get(`${test.api}/${channelId}/activities`)
      .then(r => id = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${channelId}/activities`))
      .then(r => cloud.withOptions({ qs: { where: `id='${id}'` } }).get(`${test.api}/${channelId}/activities`))
      .then(r => expect(r.body[0]).to.include.all.keys('activityUrl', 'activityType', 'totalViewingDurationMinutes'));
  });

  it('should support GET, pagination and Ceql search for /hubs/marketing/channels/:channelId/contacts', () => {
    let id;
    return cloud.get(`${test.api}/${channelId}/contacts`)
      .then(r => id = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${channelId}/contacts`))
      .then(r => cloud.withOptions({ qs: { where: `id='${id}'` } }).get(`${test.api}/${channelId}/contacts`));
  });

  it(`should support GET, pagination and Ceql search for ${test.api}/:channelId/subscriberWebcastAttachmentAccessSummaries`, () => {
    let id;
    return cloud.get(`${test.api}/${channelId}/subscriberWebcastAttachmentAccessSummaries`)
      .then(r => id = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${channelId}/subscriberWebcastAttachmentAccessSummaries`))
      .then(r => cloud.withOptions({ qs: { where: `id='${id}'` } }).get(`${test.api}/${channelId}/subscriberWebcastAttachmentAccessSummaries`));
  });

  it(`should support GET, pagination and Ceql search for ${test.api}/:channelId/surveys  and /hubs/marketing/surveys/:surveyId/responses`, () => {
    let surveyId, id;
    return cloud.get(`${test.api}/${channelId}/surveys`)
      .then(r => surveyId = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${channelId}/surveys`))
      .then(r => cloud.withOptions({ qs: { where: `id='${surveyId}'` } }).get(`${test.api}/${channelId}/surveys`))
      .then(r => cloud.get(`/hubs/marketing/surveys/${surveyId}/responses`))
      .then(r => id = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`/hubs/marketing/surveys/${surveyId}/responses`))
      .then(r => cloud.withOptions({ qs: { where: `id='${id}'` } }).get(`/hubs/marketing/surveys/${surveyId}/responses`));
  });
});
