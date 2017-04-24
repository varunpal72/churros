'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/vendorbanks');

suite.forElement('expense', 'vendor-banks', { payload: payload }, (test) => {
  it('should support Update for /hubs/expense/vendor-banks', () => {
    return cloud.patch(test.api, payload);
  });
});