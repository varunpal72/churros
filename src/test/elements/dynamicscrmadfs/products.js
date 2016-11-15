
'use strict';

const suite = require('core/suite');

suite.forElement('crm', 'products', { payload:null }, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
