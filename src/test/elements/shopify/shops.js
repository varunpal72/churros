'use strict';

const tester = require('core/tester');
const schema = require('./assets/shops.schema');


tester.for('ecommerce', 'shops', (api) => {
  it('should allow GET for /hubs/ecommerce/shops', () => {
    return tester.find(api, schema);
  });
});
