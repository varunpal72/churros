'use strict';

const tester = require('core/tester');
const schema = require('./assets/shops.schema');

tester.for('ecommerce', 'shops', schema, (api) => {
  it('should allow GET for /hubs/ecommerce/shops', () => tester.find(api, schema));
});
