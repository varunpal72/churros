'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const contactPayload  = [
  {
    "person": {
      "id": tools.randomInt()
    }
  }
];
suite.forElement('marketing', 'lists',null, (test) => {
 it('should allow CUS for /lists', () => {
   let id,contactId,objectName;
   return cloud.get(test.api)
	  .then(r => id =r.body[0].id)
	  .then(r => cloud.get(`${test.api}/${id}`))
	  .then(r => cloud.get(`${test.api}/${id}/contacts`))
	  .then(r => contactId =r.body[0].person.id)
	  .then(r => contactPayload[0].person.id = contactId)
	  .then(r => cloud.post(`${test.api}/${id}/contacts`,contactPayload))
          .then(r => cloud.get(`${test.api}/${id}/contacts/${contactId}`))
          .then(r => cloud.get(`${test.api}/${id}/leads/${contactId}/isMember`))
          .then(r => cloud.delete(`${test.api}/${id}/contacts/${contactId}`))
	  .then(r => objectName = 'lead')
          .then(r => cloud.get(`${test.api}/${id}/${objectName}`));
	
        
});
});

