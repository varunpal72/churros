'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/customers');
const build = (overrides) => Object.assign({}, payload, overrides);
const customersPayload = build({ customerNumber : tools.randomInt()});
const updatePayload = {
          "op": "add",
          "path": "/customerNumber",
          "value": tools.randomInt()
};

suite.forElement('crm', 'customers', { payload: customersPayload }, (test) => {
 test.should.supportPagination();
 it('should allow CRUDs for /hub/crm/customers', () => {
   let id;
	 return cloud.post(test.api, customersPayload)
	  .then(r => id =r.body.id)
	  .then(r => cloud.get(`${test.api}/${id}`))
	  .then(r => cloud.get(`${test.api}/${id}`))
	  .then(r => cloud.patch(`${test.api}/${id}`,updatePayload));
  });
});
