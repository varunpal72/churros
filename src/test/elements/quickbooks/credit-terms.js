'use strict';

const suite = require('core/suite');
const payload = require('./assets/credit-terms');

suite.forElement('finance', 'credit-terms', { payload: payload }, (test) => {
  test.should.supportCrs();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
});
