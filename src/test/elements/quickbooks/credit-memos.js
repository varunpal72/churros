'use strict';

const suite = require('core/suite');
const payload = require('./assets/credit-memos');

suite.forElement('finance', 'credit-memos', { payload: payload, skip: false}, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'totalAmt = \'1\'', page: 1, pageSize: 1 }}).should.return200OnGet();
});
