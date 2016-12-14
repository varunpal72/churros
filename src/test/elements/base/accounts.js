'use strict';

const suite = require('core/suite');

suite.forElement('crm', 'accounts', {skip: true}, (test) => {
  test.should.return200OnGet();
});
