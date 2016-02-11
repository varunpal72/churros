'use strict';

const tester = require('core/tester');
const schema = require('./assets/shops.schema');

tester.forElement('ecommerce', 'shops', null, schema, (test) => {
  test.should.return200OnGet();
});
