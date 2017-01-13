'use strict';

const suite = require('core/suite');
const payload = require('./assets/payments');

suite.forElement('finance', 'payments', { payload: payload, skip: false}, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
});
