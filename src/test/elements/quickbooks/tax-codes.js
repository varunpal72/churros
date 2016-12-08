const suite = require('core/suite');

suite.forElement('finance', 'tax-codes', { payload: null }, (test) => {
  test.should.supportPagination();
  test.should.supportS();
});
