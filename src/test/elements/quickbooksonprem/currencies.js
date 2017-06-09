'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/currencies.json`);
const update = (editseq) => ({
  "EditSequence": editseq,
  "Name": tools.random()
});

suite.forElement('finance', 'currencies', { payload: payload }, (test) => {
  let id, editseq;
  it(`should support CRUDS and Ceql searching for ${test.api}`, () => {
    return cloud.post(test.api, payload)
      .then(r => {
        editseq = r.body.EditSequence;
        id = r.body.ListID;
      })
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `ListID='${id}'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.patch(`${test.api}/${id}`, update(editseq)))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
});
