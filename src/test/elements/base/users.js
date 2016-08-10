const suite = require('core/suite');

suite.forElement('crm', 'users', (test) => {
  test.should.return200OnGet();
});
