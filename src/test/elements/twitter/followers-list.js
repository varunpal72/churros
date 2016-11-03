'use strict';

const suite = require('core/suite');

suite.forElement('social', 'followers-list', null, (test) => {
  test.should.supportPagination();
  test.should.supportS();
});
