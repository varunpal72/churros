'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const chakram = require('chakram');
const activitiesPayload = tools.requirePayload(`${__dirname}/assets/activities.json`);
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/items.json`);
suite.forElement('marketing', 'activities', { payload: payload }, (test) => {

  const updatePayload= {
   
    "name":tools.random(),
    "description":"Underarmour moisture wicking material",
    "price":32.0,
    "per_registrant_limit": 2,
    "show_quantity_available": false,
    "default_quantity_total": 300


};
 var activityId;

 it(`should allow CRUDS + ${test.api}/:id/items`, () => {
    let id;
    return cloud.post(`${test.api}`,activitiesPayload)
      .then(r => activityId = r.body.id)
      .then(r => cloud.post(`${test.api}/${activityId}/items`, payload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${activityId}/items`))
      .then(r => cloud.get(`${test.api}/${activityId}/items/${id}`))
      .then(r => cloud.put(`${test.api}/${activityId}/items/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${activityId}/items/${id}`))
      .then(r => cloud.patch(`${test.api}/${activityId}`))
      .then(r => cloud.delete(`${test.api}/${activityId}`));
  });

 
});
