'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const chakram = require('chakram');
const activitiesPayload = tools.requirePayload(`${__dirname}/assets/activities.json`);
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/fees.json`);
suite.forElement('marketing', 'activities', { payload: payload }, (test) => {

  const updatePayload= {
    "label":tools.random(),
    "fee":60.00,
    "fee_scope":"BOTH",
    "early_fee":54.00,
    "late_fee":66.00,
    "has_restricted_access":true
};
 var activityId;

 it(`should allow CRUDS + ${test.api}/:id/fees`, () => {
    let id;
    return cloud.post(`${test.api}`,activitiesPayload)
      .then(r => activityId = r.body.id)
      .then(r => cloud.post(`${test.api}/${activityId}/fees`, payload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${activityId}/fees`))
      .then(r => cloud.get(`${test.api}/${activityId}/fees/${id}`))
      .then(r => cloud.put(`${test.api}/${activityId}/fees/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${activityId}/fees/${id}`))
      .then(r => cloud.patch(`${test.api}/${activityId}`))
      .then(r => cloud.delete(`${test.api}/${activityId}`));
  });

 
});
