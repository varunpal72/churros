'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'activities', (test) => {
  test.should.supportS();
  test.should.supportNextPagePagination(1);
});
