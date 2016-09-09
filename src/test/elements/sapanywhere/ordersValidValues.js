'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'orders/valid-values', null, (test) => {


  it('should get valid values for orders', () => {
    return cloud.get(test.api, { qs: { fieldName: 'status' } })
  });
});
