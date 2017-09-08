'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'bills', null, (test) => {
  it('should support SR, pagination and Ceql search for /hubs/finance/bills', () => {
    let time, id;
    return cloud.get(test.api)
      .then(r => {
        time = r.body[0].TimeModified;
        id = r.body[0].TxnID})
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `TimeModified>='${time}'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`));
  });
});