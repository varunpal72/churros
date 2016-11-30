'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('erp', 'ledger-accounts', null, (test) => {
  it('should allow SR for /hubs/erp/ledger-accounts ', () => {
    let ledgerAccountId;
    return cloud.get(test.api)
      .then(r => ledgerAccountId = r.body[0].internalId)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 5 } }).get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { where: `internalId ='${ledgerAccountId}'` } }).get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${ledgerAccountId}`));
  });
});