'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/status.json`);
const comments = tools.requirePayload(`${__dirname}/assets/statusComments.json`);

suite.forElement('social', 'status', { payload: payload }, (test) => {
  let userId, photoId;
  it(`should allow GET user/{id}/photos`, () => {
    cloud.get(`user/me`)
      .then(r => userId = r.body.id)
      .then(r => cloud.get(`user/${userId}/photos`))
      .then(r => photoId = r.body[0].id);
  });
  payload.object_attachment = photoId;

  test.should.supportCrds();
  test.should.supportPagination();

  it(`should allow POST for ${test.api}/{id}/comments`, () => {
    let statusId;
    return cloud.get(test.api)
      .then(r => statusId = r.body[0].id)
      .then(r => cloud.post(`${test.api}/${statusId}/comments`, comments));
  });
});
