'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'hooks', { payload: null }, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();

});
