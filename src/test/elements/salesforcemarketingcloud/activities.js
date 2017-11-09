'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');
const cloud = require('core/cloud');
const tools = require('core/tools');

const build = (overrides) => Object.assign({}, payload, overrides);
const activitiesPayload = build({ key: tools.random() });
const updatePayload = {
  "key": activitiesPayload.key,
  "modifiedDate": "",
  "name": tools.random(),
  "version": 1,
  "description": tools.random(),
  "workflowApiVersion": 1.0
};
suite.forElement('marketing', 'activities', { payload: activitiesPayload }, (test) => {
  it('should allow CRD for /activities', () => {
    let activitiesId;
    return cloud.post(test.api, payload)
      .then(r => activitiesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${activitiesId}`))
      .then(r => cloud.get(test.api))
      .then(r => cloud.delete(`${test.api}/${activitiesId}`))
      .then(r => cloud.post(test.api, activitiesPayload))
      .then(r => updatePayload.modifiedDate = r.body.modifiedDate)
      .then(r => cloud.put(test.api, updatePayload));
  });
});
