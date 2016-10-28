'use strict';

const suite = require('core/suite');

suite.forElement('social', 'friendships', { payload: null }, (test) => {
  let userId = "140688569";
  test.withOptions({ qs: { where: `sourceScreenName = 'madhuri_ce' and targetScreenName = 'dingbat_27'` } }).should.return200OnGet();
  test.withApi(test.api + '/incoming').should.supportPagination();
  test.withApi(test.api + '/incoming').should.return200OnGet();
  test.withApi(test.api + '/outgoing').should.supportPagination();
  test.withApi(test.api + '/outgoing').should.return200OnGet();
  test.withOptions({ qs: { id: userId, follow: true } }).should.return200OnPost();
});
