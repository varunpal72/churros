'use strict';

const suite = require('core/suite');

suite.forElement('social', 'friends-list', null, (test) => {
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
  test.should.supportS();
  test.withOptions({ qs: { where: 'screen_name = \'dingbat_27\'' } }).should.return200OnGet();
});
