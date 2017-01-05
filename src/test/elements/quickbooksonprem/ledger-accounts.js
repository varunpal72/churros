'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'ledger-accounts', null , (test) => {
    it('should support SR,Pagination and CeqlSearch for /hubs/finance/ledger-accounts ', () => {
    let id;
    return cloud.get(test.api)
      .then(r => id = r.body[0].ListID)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `Name='${id}'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`));
    });
});
