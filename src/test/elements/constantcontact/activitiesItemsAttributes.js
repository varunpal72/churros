'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const chakram = require('chakram');
const activitiesPayload = tools.requirePayload(`${__dirname}/assets/activities.json`);
const cloud = require('core/cloud');
const ItemPayload = tools.requirePayload(`${__dirname}/assets/items.json`);
const payload = tools.requirePayload(`${__dirname}/assets/attributes.json`);
suite.forElement('marketing', 'activities', { payload: payload }, (test) => {

  const updatePayload= {

    "name":tools.random(),
    "quantity_total": 75


};
 var activityId,itemId;

 it(`should allow CRUDS + ${test.api}/:ActivityId/items/:itemId/attributes`, () => {
    let id;
    return cloud.post(`${test.api}`,activitiesPayload)
      .then(r => activityId = r.body.id)
      .then(r => cloud.post(`${test.api}/${activityId}/items`, ItemPayload))
      .then(r => itemId = r.body.id)
      .then(r => cloud.post(`${test.api}/${activityId}/items/${itemId}/attributes`,payload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${activityId}/items/${itemId}/attributes`))
      .then(r => cloud.get(`${test.api}/${activityId}/items/${itemId}/attributes/${id}`))
      .then(r => cloud.put(`${test.api}/${activityId}/items/${itemId}/attributes/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${activityId}/items/${itemId}/attributes/${id}`))
      .then(r => cloud.delete(`${test.api}/${activityId}/items/${itemId}`))
      .then(r => cloud.patch(`${test.api}/${activityId}`))
      .then(r => cloud.delete(`${test.api}/${activityId}`));
  });

 
});
