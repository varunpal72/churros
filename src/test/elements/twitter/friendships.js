'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/friendships');

const updatePayload = {
  "follow": "true"
};

suite.forElement('social', 'friendships', { payload: payload }, (test) => {
  it(`should support CDS for ${test.api}`, () => {
    let userId;
    let sourceScreenName;
    return cloud.post(test.api, payload)
      .then(r => cloud.get('/hubs/social/accounts/settings'))
      .then(r => sourceScreenName = r.body.screen_name)
      .then(r => cloud.withOptions({ qs: { where: `source_screen_name = \'${sourceScreenName}\' and target_screen_name = \'${payload.screen_name}\'` } }).get(test.api))
      .then(r => userId = r.body.id)
      .then(r => cloud.put(`${test.api}/${userId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${userId}`));
  });
  test.withApi(`${test.api}/incoming`).should.supportPagination();
  test.withApi(`${test.api}/incoming`).should.return200OnGet();
  test.withApi(`${test.api}/incoming`).should.supportNextPagePagination(1);
  test.withApi(`${test.api}/outgoing`).should.supportPagination();
  test.withApi(`${test.api}/outgoing`).should.return200OnGet();
});
