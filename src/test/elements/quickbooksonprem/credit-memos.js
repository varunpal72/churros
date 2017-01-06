'use strict';

const suite = require('core/suite');
const payload = require('./assets/credit-memos');
const cloud = require('core/cloud');
const updatePayload ={ "Subtotal":"25600.00" };

suite.forElement('finance', 'credit-memos', { payload: payload}, (test) => {
    it('should support CRUDS,Pagination for /hubs/finance/credit-memos ', () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.TxnID)
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => updatePayload.EditSequence = r.body.EditSequence)
      .then(r => cloud.patch(`${test.api}/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${id}`));      
  });
});
