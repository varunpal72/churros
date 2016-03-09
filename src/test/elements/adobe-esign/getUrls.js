'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');
const chakram = require('chakram');
const cloud = require('core/cloud');
//const winston = require('winston');
const tools = require('core/tools');
const expect = chakram.expect;


suite.forElement('esignature', 'geturls', null, (test) => {
//GET all
	it('should allow GET for ' + '/hubs/esignature/geturls', () => {    
		return cloud.get(test.api)  
  });
});  