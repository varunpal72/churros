'use strict';

const suite = require('core/suite');
const payload = require('./assets/messages');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('collaboration', 'messages', payload, (test) => {
  let userId, otherUserIds;
  before((done) => cloud.get('/me')
    .then(r => {
      userId = r.body.user_id;
      payload.user = userId;
    })
    .then(r => cloud.get('/users'))
    .then(r => {
      expect(r.body).to.not.be.empty;
      otherUserIds = r.body.filter(obj => obj.name !== 'claude' && obj.name !== 'slackbot').map(obj => obj.id).join(',');
    })
    .then(r => done()));


  let msgPayload = { 'text': 'tester' };
  let updatedPayload = {
    'user': userId,
    'ts': Date.parse(new Date()).toString()
  };
  it(`should support CRUD for ${test.api}`, () => {
    let directMessageChannelId, ts;
    return cloud.post(test.api, payload)
      .then(r => directMessageChannelId = r.body.channel.id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${directMessageChannelId}`))
      .then(r => cloud.post(`/channels/${directMessageChannelId}/messages`, msgPayload))
      .then(r => {
        ts = r.body.message.ts ? r.body.message.ts : Date.parse(new Date()).toString();
        updatedPayload.ts = ts;
      })
      .then(r => cloud.patch(`${test.api}/${directMessageChannelId}`, updatedPayload))
      .then(r => cloud.delete(`${test.api}/${directMessageChannelId}`));
  });

  it(`should support CRUD for ${test.api} with group query parameter`, () => {
    let directMessageChannelId, ts;
    payload.user = otherUserIds;
    return cloud.withOptions({ qs: { 'group': true } }).post(test.api, payload)
      .then(r => directMessageChannelId = r.body.id)
      .then(r => cloud.withOptions({ qs: { 'group': true } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { 'group': true } }).get(`${test.api}/${directMessageChannelId}`))
      .then(r => cloud.post(`/channels/${directMessageChannelId}/messages`, msgPayload))
      .then(r => {
        ts = r.body.message.ts ? r.body.message.ts : Date.parse(new Date()).toString();
        updatedPayload.ts = ts;
        updatedPayload.users = otherUserIds;
      })
      .then(r => cloud.withOptions({ qs: { 'group': true } }).patch(`${test.api}/${directMessageChannelId}`, updatedPayload))
      .then(r => cloud.withOptions({ qs: { 'group': true } }).delete(`${test.api}/${directMessageChannelId}`));
  });

});
