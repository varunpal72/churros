'use strict';

const suite = require('core/suite');
const payload = require('./assets/expenses');
const cloud = require('core/cloud');

suite.forElement('payment', 'expenses', { payload: payload }, (test) => {
  it(`should allow POST for /hubs/crm/expenses`, () => {
    return cloud.post(test.api, payload);
  });
});
