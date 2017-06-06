'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/time-activities.json`);
const updatePayload = (editseq) => ({
  "BillableStatus": "Billable",
  "EditSequence": editseq,
  "Duration": "PT12H00M",
  "EntityRef": {
    "FullName": "Elizabeth N. Mason"
  },
  "Notes": "Single activity time sheet Update",
  "TxnNumber": "0"
});

suite.forElement('finance', 'time-activities', { payload: payload }, (test) => {
  let id, editseq;
  it('should support CRUDS for /hubs/finance/time-activities', () => {
    return cloud.post(test.api, payload)
      .then(r => {
        id = r.body.TxnID;
        editseq = r.body.EditSequence;
      })
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.withOptions({ qs: { where: `TxnID='${id}'` } }).get(test.api))
      .then(r => cloud.patch(`${test.api}/${id}`, updatePayload(editseq)))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
  test.should.supportPagination();
});
