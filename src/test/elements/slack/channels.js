'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/channels');

suite.forElement('collaboration', 'channels', (test) => {
  let privateChannelId, publicChannelId;
  payload.name = tools.random();
  before((done) => cloud.withOptions({ qs: { private: true } }).post(test.api, payload)
    .then(r => {
      privateChannelId = r.body.id;
      payload.name = tools.random();
    })
    .then(r => cloud.post(test.api, payload))
    .then(r => publicChannelId = r.body.id)
    .then(r => done()));

  //delete my generic channels
  let archive = { 'action': 'archive' };
  after(() => cloud.withOptions({ qs: { private: true } }).patch(`${test.api}/${privateChannelId}/actions`, archive)
    .then(() => cloud.withOptions({ qs: { private: false } }).patch(`${test.api}/${publicChannelId}/actions`, archive)));

  //test for GET channels
  test.should.return200OnGet();
  test.should.supportPagination();

  //tests for /messages apis
  let timestamp;
  let channelMessage = { 'text': 'How are you' };
  it(`should allow CUD ${test.api}/messages`, () => {
    return cloud.post(`${test.api}/${privateChannelId}/messages`, channelMessage) // test for POST channels/{channelId}/messages
      .then(r => timestamp = r.body.ts)
      .then(r => cloud.patch(`${test.api}/${privateChannelId}/messages`, { 'ts': timestamp, 'text': 'Hey Guys' })) // test for PATCH channels/{channelId}/messages
      .then(r => cloud.delete(`${test.api}/${privateChannelId}/messages/${timestamp}`)); //test for delete channels/{channelId}/messages/{timestamp}
  });

  // test for invite, kick, my-messages and history
  let inviteUser = { 'users': '' };
  it(`should allow GET ${test.api}`, () => {
    return cloud.get(`users`)
      .then(r => inviteUser.users = r.body[1].id); //get a user
  });
  it(`should allow CD ${test.api}/:channelId/user`, () => {
    return cloud.withOptions({ qs: { private: true } }).post(`${test.api}/${privateChannelId}/user`, inviteUser) // test for POST channels/{channelId}/user
      .then(r => cloud.withOptions({ qs: { private: true } }).delete(`${test.api}/${privateChannelId}/user/${inviteUser.users}`)); // test for delete channels/{channelId}/user/{userId}
  });

  it(`should allow POST ${test.api}/:channelId/my-messages api`, () => {
    return cloud.withOptions({ qs: { private: true } }).post(`${test.api}/${privateChannelId}/my-messages`, { 'text': 'Hello' }); // test for POST channels/{channelId}/my-messages
  });

  it(`should allow GET ${test.api}/:channelId/history api`, () => {
    return cloud.withOptions({ qs: { private: false } }).get(`${test.api}/${publicChannelId}/history`);
  });

  it(`should allow where count GET ${test.api}/:channelId/history api`, () => {
    return cloud.withOptions({ qs: { private: false, where: 'count = 1' } }).get(`${test.api}/${publicChannelId}/history`);
  });

  //TODO get these working - begin doesn't populate a variable for a suite test :(
  test.withApi(`${test.api}/${publicChannelId}/history`).should.supportPagination();
  // test.withApi(`${test.api}/${publicChannelId}/history`).withOptions({ qs: { 'where': 'count = 1 ' } }).should.return200OnGet();

  // define all supported actions and payloads
  const actions = [
    { 'action': 'join', 'name': '' },
    { 'action': 'read', 'ts': Date.parse(new Date()) },
    { 'action': 'leave' },
    { 'action': 'archive' }
  ];
  const actions2 = [
    { 'action': 'unarchive' },
    { 'action': 'rename', 'name': tools.random() },
    { 'action': 'purpose', 'purpose': 'eat yummy churros' },
    { 'action': 'topic', 'topic': 'tasty desserts' },
    { 'action': 'leave' }
  ];
  it(`should allow GET ${test.api}`, () => {
    return cloud.withOptions({ qs: { private: true } }).get(test.api)
      .then(r => actions[0].name = r.body[0].id); //get a user for 'actions' apis
  });
  it(`should allow PATCH ${test.api}/:channelId/actions`, () => {
    actions.forEach(ac => (cloud.withOptions({ qs: { private: true } }).patch(`${test.api}/${privateChannelId}/actions`, ac)));
    actions2.forEach(ac => (cloud.withOptions({ qs: { private: true } }).patch(`${test.api}/${privateChannelId}/actions`, ac)));
  });

});
