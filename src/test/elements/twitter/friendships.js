'use strict';

const suite = require('core/suite');
const payload = require('./assets/friendships');

suite.forElement('social', 'friendships', { payload: payload }, (test) => {
  test.withOptions({ qs: { where: `source_screen_name = 'madhuri_ce' and target_screen_name = 'dingbat_27'` } }).should.return200OnGet();
  test.withApi(`${test.api}/incoming`).should.supportPagination();
  test.withApi(`${test.api}/incoming`).should.return200OnGet();
  test.withApi(`${test.api}/outgoing`).should.supportPagination();
  test.withApi(`${test.api}/outgoing`).should.return200OnGet();
  test.should.return200OnPost();
});
