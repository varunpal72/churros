'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');
const tools = require('core/tools');
const cloud = require('core/cloud');
const updatePayload ={ "Name": tools.random(), "ItemType": "ItemInventory" };

suite.forElement('finance', 'products', { payload: payload}, (test) => {
    it('should support CRUDS,Pagination for /hubs/finance/products ', () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.ListID)
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `ListID='${id}'` } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => updatePayload.EditSequence = r.body.EditSequence)
      .then(r => cloud.patch(`${test.api}/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${id}`));      
  });
});
