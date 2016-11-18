'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/customers');
const build = (overrides) => Object.assign(}, payload, overrides);
const customersPayload = build({ customerNumber : tools.randomInt(),billingAddress.firstName: tools.random(),  billingAddress.lastName: tools.random()});
const updatePayload = {
      "customers": [
        {
          "op": "add",
          "path": "/customerNumber",
          "value": "0812"
        }
      ]
};
suite.forElement('crm', 'customers', { payload: customersPayload }, (test) => {
 test.should.supportPagination();
 it('should allow SRU for /hub/crm/orders', () => {
   let id;
	 return cloud.post(test.api, customersPayload)
	  .then(r => id =r.body.customerId)
	  .then(r => cloud.get(`${test.api}/${id}`))
	  .then(r => cloud.patch(`${test.api}/${id}`,updatePayload));
  });*/
});
