'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'stores-configs', (test) => {
  test.withOptions({ qs: { where: `storeCodes = 'default'` }}).should.return200OnGet();
  test.withApi('/hubs/ecommerce/stores').should.return200OnGet();
  test.withApi('/hubs/ecommerce/stores-groups').should.return200OnGet();
  test.withApi('/hubs/ecommerce/stores-websites').should.return200OnGet();
    test.should.supportPagination();
});
