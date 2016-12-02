'use strict';

const suite = require('core/suite');
//const payload = require('./assets/contacts');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload  = {
  "person": {
      "lastName": tools.randomStr(),
      "firstName": tools.randomStr(),
      "email": tools.randomEmail()
    }
};

const updatedPayload  = {
  "person": {
      "lastName": tools.randomStr(),
      "firstName": tools.randomStr(),
      "email": tools.randomEmail()
    }
};

const interactionPayload = {

  "id":tools.randomInt(), 
  "token":tools.randomInt()
};
suite.forElement('marketing', 'contacts', { payload: payload}, (test) => {
 it('should allow CUS for /contacts', () => {
   let id,value;
   return cloud.post(test.api,payload)
	  .then(r => id =r.body.person.id)
	  .then(r => value=`in ( ${id} )`)
	  .then(r => cloud.get(`${test.api}/${id}`))
	  .then(r => cloud.patch(`${test.api}/${id}`,updatedPayload))
          .then(r => cloud.withOptions({ qs: {id : value }}).get(`${test.api}/${id}`))
	  .then(r => cloud.post(`${test.api}/${id}/interactions`,interactionPayload))
          .then(r => cloud.withOptions({ qs: { where : "sinceDate = '2016-11-25T11:39:58Z'"}}).get(`/hubs/marketing/deleted-contacts`))
          .then(r => cloud.withOptions({ qs: { where : "sinceDate = '2016-11-25T11:39:58Z'"}}).get(`/hubs/marketing/changed-contacts`))
 	  .then(r => cloud.delete(`${test.api}/${id}`));
});
});

