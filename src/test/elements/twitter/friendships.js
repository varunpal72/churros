'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/friendships');

suite.forElement('social', 'friendships', { payload: payload }, (test) => {
  it(`should support CDS for ${test.api}`, () => {
    let userId;
    return cloud.post(test.api, payload)
      .then(r => cloud.withOptions({ qs: { where: 'source_screen_name = \'madhuri_ce\' and target_screen_name = \'johnsnow_ce\'' } }).get(test.api))
      .then(r => userId = r.body.target.id_str)
      .then(r => cloud.delete(`${test.api}/${userId}`));
  });
  test.withApi(`${test.api}/incoming`).should.supportPagination();
  test.withApi(`${test.api}/incoming`).should.return200OnGet();
  test.withApi(`${test.api}/incoming`).should.supportNextPagePagination(1);
  test.withApi(`${test.api}/outgoing`).should.supportPagination();
  test.withApi(`${test.api}/outgoing`).should.return200OnGet();
});
