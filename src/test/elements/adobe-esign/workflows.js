'use strict';

const suite = require('core/suite');
//const payload = require('./assets/libraryDocuments');
//const chakram = require('chakram');
const cloud = require('core/cloud');
//const winston = require('winston');
const tools = require('core/tools');
//const expect = chakram.expect;


suite.forElement('esignature', 'workflows', null, (test) => {
	let workflowId = '3AAABLblqZhDxBYJolhNTN97iasNYVJSz7j5mN5Nz-DiDtNe1lVP5FyRxfRmAK1uezvNn-LcePWX9M1nZ0CEAeVrA6VETr6Uc'
//GET all
	it('should allow GET for ' + test.api, () => {    
		return cloud.get(test.api)  
  });
  
//GET /workflows/{workflowId}
	it('should allow GET for ' + test.api+'/'+workflowId, () => {    
		return cloud.get(test.api+ '/' + workflowId)  
  });
});  