'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'payments', null , (test) => {
    it('should support SR,Pagination and CeqlSearch for /hubs/finance/payments ', () => {
    let id;
    return cloud.get(test.api)
      .then(r => id = r.body[0].TxnID)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `TxnID='${id}'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`));
    });
});
