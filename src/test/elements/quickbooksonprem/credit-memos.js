'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/credit-memos.json`);
const update = (editseq) => ({
  "EditSequence": editseq,
  "SalesTaxTotal": 0
});

suite.forElement('finance', 'credit-memos', { payload: payload }, (test) => {
  let id, editseq, refno;
  it(`should support CRUDS and Ceql searching for ${test.api}`, () => {
    return cloud.post(test.api, payload)
      .then(r => {
        editseq = r.body.EditSequence;
        id = r.body.id;
        refno = r.body.RefNumber;
      })
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { where: `RefNumber='${refno}'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.patch(`${test.api}/${id}`, update(editseq)))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
  test.should.supportPagination();
});
