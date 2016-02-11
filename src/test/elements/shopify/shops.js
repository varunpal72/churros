'use strict';

const tester = require('core/tester');
const schema = require('./assets/shops.schema');

tester.forElement('ecommerce', 'shops', null, schema, (suite) => {
  suite.should.return200OnGet();
});
