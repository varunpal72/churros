'use strict';

const suite = require('core/suite');
const payload = require('./assets/interactions');
const cloud = require('core/cloud');
const tools = require('core/tools');

const build = (overrides) => Object.assign({}, payload, overrides);
const interactionPayload = build({ key:tools.random()});
const updatePayload={
   "key":interactionPayload.key,
   "modifiedDate":"",
   "name": tools.random(),
   "version":1,
   "description":tools.random(),
   "workflowApiVersion":1.0
};
suite.forElement('marketing', 'interactions', { payload: interactionPayload }, (test) => {
  it('should allow CRD for /interactions', () => {
    let interationId,modifiedDate;
    return cloud.post(test.api,payload)
	    .then(r => interationId = r.body.id)
      .then(r => cloud.get(test.api + '/' + interationId))
      .then(r => cloud.get(test.api))
      .then(r => cloud.delete(test.api + '/' + interationId))
	    .then(r =>cloud.post(test.api,interactionPayload ))
	    .then(r =>updatePayload.modifiedDate=r.body.modifiedDate)
	    .then(r => cloud.put(test.api,updatePayload));
 });
});
