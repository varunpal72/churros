'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const updatePayload = { "Name": tools.random(), "ItemType": "ItemInventory" };

suite.forElement('finance', 'products', { payload: payload }, (test) => {
  test.should.supportPagination();
  it.skip('should support Ceql search for /hubs/finance/products', () => {
    let id;
    return cloud.get(test.api)
      .then(r => {
        expect(r.body).to.not.be.empty;
        id = r.body[0].ListID;
      })
      .then(r => cloud.withOptions({ qs: { where: `ListId='${id}'` } }).get(test.api))
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body[0].ListID).to.equal(id);
      });
  });

  it.skip('should support CRUDS, pagination for /hubs/finance/products', () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.ListID)
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `ListId='${id}'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => updatePayload.EditSequence = r.body.EditSequence)
      .then(r => cloud.patch(`${test.api}/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
});
