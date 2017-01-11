'use strict';

const suite = require('core/suite');
const payload = require('./assets/payroll-wage-items');
const cloud = require('core/cloud');

suite.forElement('finance', 'payroll-wage-items', { payload: payload }, (test) => {
  it('should support CRUDS, pagination for /hubs/finance/payroll-wage-items', () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.ListID)
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
});