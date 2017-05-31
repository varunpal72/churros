'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/status.json`);

suite.forElement('social', 'status', { payload:payload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();

  it('should allow POST and DELETE likes', () => {
    let pageId,accessToken,statusId;
    return cloud.get(`/hubs/social/pages`)
      .then(r => pageId = r.body[0].id)
      .then(r => cloud.get(`/hubs/social/pages/${pageId}/page-access-token`))
      .then(r => accessToken = r.body.access_token)
      .then(r => cloud.post(`/hubs/social/user/${pageId}/status`,payload))
      .then(r => statusId = r.body.id)
      .then(r => cloud.withOptions({ qs: {pageToken: accessToken } }).post(`/hubs/social/status/${statusId}/like`))
      .then(r => cloud.withOptions({ qs: {pageToken: accessToken } }).delete(`/hubs/social/user/likes/${statusId}`));
  });
});
