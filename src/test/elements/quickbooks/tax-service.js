'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/tax-service');
// Need to Skip because there is no delete and you dont want to
// keep creating new tax-codes
suite.forElement('finance', 'tax-service', { payload: payload, skip: true }, (test) => {
  it('should support create tax-service', () => {
    return cloud.post(test.api, payload);
  });
});
