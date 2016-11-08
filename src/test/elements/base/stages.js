const suite = require('core/suite');

suite.forElement('crm', 'stages', (test) => {
  test.should.return200OnGet();
});
