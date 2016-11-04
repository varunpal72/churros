'use strict';

const suite = require('core/suite');
const payload = require('./assets/friendships');

suite.forElement('social', 'friendships', { payload: payload }, (test) => {
  test.withOptions({ qs: { where: `sourceScreenName = 'madhuri_ce' and targetScreenName = 'dingbat_27'` } }).should.return200OnGet();
  test.withApi(`${test.api}/incoming`).should.supportPagination();
  test.withApi(`${test.api}/incoming`).should.return200OnGet();
  test.withApi(`${test.api}/outgoing`).should.supportPagination();
  test.withApi(`${test.api}/outgoing`).should.return200OnGet();
  test.should.return200OnPost();
});
