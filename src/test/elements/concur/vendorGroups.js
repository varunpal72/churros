'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/vendorgroups');

suite.forElement('expense', 'vendor-groups', { payload: payload }, (test) => {
  it('should support Ud for /hubs/expense/vendor-groups', () => {
    return cloud.withOptions({ qs: { vendorCode: '8C6FBE02421049F1B03CA0E85CD170B2', addressCode: 'INR' } }).patch(test.api, payload)
      .then(r => cloud.withOptions({ qs: { groupName: 'name', vendorCode: '8C6FBE02421049F1B03CA0E85CD170B2', addressCode: 'INR' } }).delete(test.api));
  });
});