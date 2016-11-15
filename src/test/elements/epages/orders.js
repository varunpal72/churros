'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = [
  {
    "op": "add",
    "path": "/customerComment",
    "value": "Please deliver asap."
  }
];

suite.forElement('crm', 'orders', { payload: payload }, (test) => {	
 let id;
 it('should allow SRU for /orders', () => {
	   return cloud.get(test.api)
	  .then(r => id =r.body[0].id)
	  .then(r => cloud.get(`${test.api}/${id}`))
	  .then(r => cloud.patch(`${test.api}/${id}`,payload));
});
});
