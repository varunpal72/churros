'use strict';

const suite = require('core/suite');
const payload = require('./assets/messages');
const cloud = require('core/cloud');

suite.forElement('collaboration', 'messages', payload, (test) => {
let updatedPayload={
  'user': 'U35AMQM08',
  'ts': Date.parse(new Date())
};
  it(`should support CRUD /{test.api}/:MessageChannelId`, () => {
      let directMessageChannelId;
    return cloud.post(test.api,payload)
    .then(r=> directMessageChannelId=r.body.channel.id )
    .then(r=> cloud.get(`${test.api}/${directMessageChannelId}`))
    .then(r=> cloud.patch(`${test.api}/${directMessageChannelId}`,updatedPayload))
    .then(r=> cloud.delete(`${test.api}/${directMessageChannelId}`));
  });

// tests for 'group = true'
  it(`should support CRUD /{test.api}/:MessageChannelId with group query parameter`, () => {
      let directMessageChannelId;
    return cloud.withOptions({qs:{'group' : true}}).post(test.api,payload)
    .then(r=> directMessageChannelId=r.body.channel.id )
    .then(r=> cloud.withOptions({qs:{'group' : true}}).get(`${test.api}/${directMessageChannelId}`))
    .then(r=> cloud.withOptions({qs:{'group' : true}}).patch(`${test.api}/${directMessageChannelId}`,updatedPayload))
    .then(r=> cloud.withOptions({qs:{'group' : true}}).delete(`${test.api}/${directMessageChannelId}`));
  });

  });
