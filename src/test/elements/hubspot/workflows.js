'use strict';

const suite = require('core/suite');
const payload = require('./assets/workflows');

suite.forElement('marketing', 'workflows', { payload: payload }, (test) => {
  test.should.supportCrds();
  test.should.supportNextPagePagination(2);
});
