'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');
const chakram = require('chakram');
const cloud = require('core/cloud');
//const winston = require('winston');
const tools = require('core/tools');
const expect = chakram.expect;

const createUsers = () => ({
  "lastName": tools.random(),
  "email": tools.randomEmail(),
  "firstName": tools.random()

});

suite.forElement('esignature', 'users', null, (test) => {
//POST
	let userId;
	it('should allow POST for ' + test.api, () => {    
		return cloud.post(test.api,createUsers())
		.then(r => userId = r.body.id)
		.then(r => cloud.get(test.api+ '/' + userId))
		.then(r => cloud.get(test.api))
		});
/*
//GET all
	it('should allow GET for ' + test.api, () => {    
		return cloud.get(test.api)  
  });
  
//GET by ID
	it('should allow GET for ' + test.api+'/{userId}', () => {  
		let userId;
    	return cloud.post(test.api, payload)
      		.then(r =>userId = r.body.id)
      		.then(r => cloud.get(test.api+ '/' + userId))   
  });
/*
//PUT
	it('should allow PUT for ' + test.api, () => {  
		let userId;
    	return cloud.post(test.api, payload)
      		.then(r =>userId = r.body.id)
      		.then(r => cloud.get(test.api+ '/' + userId))   
  });	
*/

  
});



/*
const group = () => ({
  groupName: tools.random()
});


suite.forElement('esignature', 'users', group(), (test) => {
test.should.supportCruds(chakram.put);
//test.should.return404OnGet(9999);
//test.should.return200OnPost();
//test.should.supportCrud();

/*
  it('should allow CRUDS for ' + test.api, () => {
    let groupId;
    return cloud.post(test.api, group())
      .then(r =>groupId = r.body.id)
      .then(r => cloud.get(test.api+ '/' + groupId))
//      .then(r => cloud.delete(test.api + '/' + groupId))      
  });
  */

/*  

  it('should allow for '+test.api+ '/' + '{groupId}/users', () => {
    let groupId;
    return cloud.post(test.api, group())
      .then(r =>groupId = r.body.id)
      .then(r => cloud.get(test.api+ '/' + groupId+'/users'))
      .then(r => expect(r).to.have.statusCode(200))
      .then(r => cloud.delete(test.api + '/' + groupId))      
  });  
});

*/
