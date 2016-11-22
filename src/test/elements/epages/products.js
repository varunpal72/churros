'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/products');
const build = (overrides) => Object.assign({}, payload, overrides);
const productPayload = build({ productNumber : tools.random(),name : tools.randomStr(),shortDescription : tools.randomStr(),manufacturer : tools.randomStr(),price :tools.randomInt(), description : tools.randomStr()});
const updatePayload = {
  "op": "add",
  "path": "/name",
  "value": tools.randomStr()
};

suite.forElement('crm', 'products', { payload: productPayload }, (test) => {
 test.should.supportPagination();
 it('should allow SRU for /hub/crm/products', () => {
   let id;
	 return cloud.post(test.api, productPayload)
	  .then(r => id =r.body.id)
	  .then(r => cloud.get(`${test.api}/${id}`))
	  .then(r => cloud.get(`${test.api}`))
	  .then(r => cloud.patch(`${test.api}/${id}`,updatePayload))
	  .then(r => cloud.delete(`${test.api}/${id}`));
  });
});
