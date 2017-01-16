'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/tax-service');

suite.forElement('finance', 'tax-service', { payload: payload, skip: false }, (test) => {
  it('should support create tax-service', () => {
    return cloud.post(test.api, payload);
  });
});
