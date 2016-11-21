const suite = require('core/suite');

suite.forElement('crm', 'stages', {skip: true}, (test) => {
  test.should.return200OnGet();
});
