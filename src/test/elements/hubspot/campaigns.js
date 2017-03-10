'use strict';

const suite = require('core/suite');

// Cannot create campaign from Trial?
suite.forElement('marketing', 'campaigns', { skip: true }, (test) => {
  test.should.supportSr();
  test.should.supportNextPagePagination(1);
});
