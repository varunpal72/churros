'use strict';

const suite = require('core/suite');
const payload = require('./assets/workflows');

// Can't create workflows as of right now? Investigating (@tyltot)
suite.forElement('marketing', 'workflows', { payload: payload, skip: true }, (test) => {
  test.should.supportCrds();
  test.should.supportNextPagePagination(1);
});
