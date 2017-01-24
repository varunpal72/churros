const suite = require('core/suite');

suite.forElement('finance', 'tax-codes', null, (test) => {
  test.should.supportPagination();
  test.should.supportS();
});
