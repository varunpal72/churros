const suite = require('core/suite');

suite.forElement('crm', 'users', {skip: true}, (test) => {
  test.should.return200OnGet();
});
