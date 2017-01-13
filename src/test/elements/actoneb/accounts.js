'use strict';
const suite = require('core/suite');
suite.forElement('marketing', 'accounts', null, (test) => {
  test.should.return200OnGet();
});
