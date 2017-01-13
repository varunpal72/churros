'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');
const cloud = require('core/cloud');
const campaignSendMessage = require('./assets/campaignsend');
const updatePayload = {
  "senderemail": "acton@cloud-elements.com",
  "sendername": "churros test",
  "subject": "Test Update",
  "sendtoids": "l-00d7",
  "when": "1481052621"
};
suite.forElement('marketing', 'campaigns', { payload: payload }, (test) => {
  it('it should support CRUDS for campaigns', () => {
    let msgId, sendId;
    return cloud.post(test.api, payload)
      .then(r => msgId = r.body.msg_id)
      .then(r => cloud.get(`${test.api}/${msgId}`))
      .then(r => cloud.patch(`${test.api}/${msgId}`, payload))
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${msgId}/reports`))
      .then(r => cloud.get(`${test.api}/${msgId}/reports/SENT`))
      .then(r => cloud.post(`${test.api}/${msgId}/send`, campaignSendMessage))
      .then(r => sendId = r.body.sendId)
      .then(r => cloud.patch(`${test.api}/${sendId}/send`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${msgId}`));
  });
});
