'use strict';

const suite = require('core/suite');

suite.forElement('social', 'followers-ids', { payload: null }, (test) => {
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
  test.should.supportS();
});
