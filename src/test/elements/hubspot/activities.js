'use strict';

const suite = require('core/suite');

// Can't create activity from trial??
suite.forElement('marketing', 'activities', { skip: true }, (test) => {
  test.should.supportS();
  test.should.supportNextPagePagination(1);
});
