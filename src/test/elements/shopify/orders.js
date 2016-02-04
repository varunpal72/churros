'use strict';

const tester = require('core/tester');
const schema = require('./assets/orders.schema');

tester.for('ecommerce', 'orders', (api) => {
  // checkout functions available under tester.test which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  it('brad should insert some tests here :)', () => true);
});
