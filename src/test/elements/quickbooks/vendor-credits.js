'use strict';

const suite = require('core/suite');
const payload = require('./assets/vendor-credits');

suite.forElement('finance', 'vendor-credits', { payload: payload, skip: true}, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('totalAmt');
});
