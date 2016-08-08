'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'stores', (test) => {
  test.should.return200OnGet();
  test.withApi('/hubs/ecommerce/stores-configs').should.return200OnGet();
  test.withApi('/hubs/ecommerce/stores-groups').should.return200OnGet();
  test.withApi('/hubs/ecommerce/stores-websites').should.return200OnGet();
});
