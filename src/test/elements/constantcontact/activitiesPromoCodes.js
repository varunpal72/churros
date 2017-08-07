'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const chakram = require('chakram');
const activitiesPayload = tools.requirePayload(`${__dirname}/assets/activities.json`);
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/promoCodes.json`);
const updatePayload = tools.requirePayload(`${__dirname}/assets/promoCodes.json`);
suite.forElement('marketing', 'activities', { payload: payload }, (test) => {

 var activityId;

 it(`should allow CRUDS + ${test.api}/:id/promo-codes`, () => {
    let id;
    return cloud.post(`${test.api}`,activitiesPayload)
      .then(r => activityId = r.body.id)
      .then(r => cloud.post(`${test.api}/${activityId}/promo-codes`, payload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${activityId}/promo-codes`))
      .then(r => cloud.get(`${test.api}/${activityId}/promo-codes/${id}`))
      .then(r => cloud.put(`${test.api}/${activityId}/promo-codes/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${activityId}/promo-codes/${id}`))
      .then(r => cloud.patch(`${test.api}/${activityId}`))
      .then(r => cloud.delete(`${test.api}/${activityId}`));
  });

 
});
