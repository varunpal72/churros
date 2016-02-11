'use strict';

const suite = require('core/suite');
const schema = require('./assets/shops.schema');

suite.forElement('ecommerce', 'shops', null, schema, (test) => {
  test.should.return200OnGet();
});
