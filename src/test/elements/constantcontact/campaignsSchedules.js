'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const chakram = require('chakram');
const cloud = require('core/cloud');
const campaingsPayload = tools.requirePayload(`${__dirname}/assets/campaigns.json`);
const listsPayload =tools.requirePayload(`${__dirname}/assets/lists.json`);
const contactPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const payload = tools.requirePayload(`${__dirname}/assets/schedules.json`);


suite.forElement('marketing', 'campaings', { payload: payload }, (test) => {

  const updatePayload= {
    "label":tools.random(),
    "fee":60.00,
    "fee_scope":"BOTH",
    "early_fee":54.00,
    "late_fee":66.00,
    "has_restricted_access":true
};
 var activityId,contactId;

 it(`should allow CRUDS + ${test.api}/:id/fees`, () => {
    let id,cId,contactId,listId;
    return cloud.post(`/hubs/marketing/lists`, listsPayload)
      .then(r => listId = r.body.id)
      .then(r => cloud.post(`/hubs/marketing/lists/${listId}/contacts`, contactPayload))
          .then(r => contactId=r.body.id)
      .then(r => campaingsPayload.sent_to_contact_lists[0].id=contactId)
      .then(r => cloud.post(`${test.api}`, campaingsPayload))
      .then(r => cId = r.body.id)
      .then(r => cloud.post(`${test.api}/${cId}/schedules`,payload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${cId}/schedules`))
      .then(r => cloud.get(`${test.api}/${cId}/schedules/${id}`))
      .then(r => cloud.put(`${test.api}/${cId}/schedules/${id}`, {}))
      .then(r => cloud.delete(`${test.api}/${cId}`))
      .then(r => cloud.delete(`/hubs/marketing/lists/${listId}/contacts/${contactId}`))
      .then(r => cloud.delete(`/hubs/marketing/lists/${listId}`));
  });

 
});
