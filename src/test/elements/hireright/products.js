'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('screening', 'products', (test) => {

  it('should allow listing products', () => {
    return cloud.get('/hubs/screening/products');
  });

});
