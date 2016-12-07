'use strict';

const suite = require('core/suite');
const payload = require('./assets/purchase-order');

suite.forElement('finance', 'purchase-order', { payload: payload, skip: false}, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('totalAmt');
});
