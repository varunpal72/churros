'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/groups.json`);
const contactPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);

suite.forElement('general', 'groups', { payload: payload }, (test) => {

  const groupMemberPayload={
	            "resourceNamesToAdd":[
		     ]};
  before(() => cloud.post(`/hubs/general/contacts`, contactPayload)
	.then(r => groupMemberPayload.resourceNamesToAdd.push("people/"+r.body.id)));
 

  let groupId;
  it('should test CRUD of  groups', () => {
  return cloud.post(test.api, payload)
   .then(r => {
	       groupId=r.body.id;
	       payload.etag=r.body.etag
              })
  // .then(r => cloud.patch(`${test.api}/${groupId}`, payload))
   .then(r => cloud.get(`${test.api}/${groupId}`))
   .then(r => cloud.withOptions({ qs: { id: 'all' } }).get(`/hubs/general/groups-batch`))
   .then(r => cloud.patch(`${test.api}/${groupId}/members`, groupMemberPayload))
   .then(r => cloud.delete(`${test.api}/${groupId}`))
  });
});
