'use strict';

const suite = require('core/suite');

suite.forElement('social', 'followers-list', null, (test) => {
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
  test.should.supportS();
});
