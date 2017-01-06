'use strict';

const suite = require('core/suite');

suite.forElement('crm', 'deals', null, (test) => {
  test.should.return200OnGet();
});
