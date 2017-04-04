'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('collaboration', 'channels', (test) => {
  //test for GET channels
 test.should.return200OnGet();
  test.should.supportPagination();

//tests for /messages apis
let channelId, timestamp;
let channelMessage= {'text' : 'How are you' };
let createPayload = { 'name': 'Dave McKay'+ Date.parse(new Date())/10000};  // to get a unique channel name
 it.skip(`should allow CUD /{test.api}/messages`, () => {
    return cloud.withOptions({qs: {private: true}}).post(test.api,createPayload)
    .then(r=> channelId = r.body.channel.id)
    .then(r => cloud.post(`${test.api}/${channelId}/messages`,channelMessage))  // test for POST channels/{channelId}/messages
    .then(r=> timestamp = r.body.ts)
    .then(r => cloud.patch(`${test.api}/${channelId}/messages`,{'ts' : timestamp, 'text' : 'Hey Guys'})) // test for PATCH channels/{channelId}/messages
    .then(r => cloud.delete(`${test.api}/${channelId}/messages/${timestamp}`)); //test for delete channels/{channelId}/messages/{timestamp}
  });

  // test for invite, kick, my-messages and history
    let inviteUser= {'users': ''};
    it(`should allow GET /{test.api}`,() => {
        return cloud.get(`users`)
      .then(r => inviteUser.user = r.body[1].id );  //get a user
    });
      it(`should allow CD {test.api}/:channelId/user`, () => {
      return  cloud.withOptions({qs: {private: true}}).post(`${test.api}/${channelId}/user`,inviteUser) // test for POST channels/{channelId}/user
      .then(r => cloud.withOptions({qs: {private: true}}).delete(`${test.api}/${channelId}/user/${inviteUser.user}`)); // test for delete channels/{channelId}/user/{userId}
      });

it.skip(`should allow POST /{test.api}/:channelId/my-messages api`, () => {
   cloud.withOptions({qs: {private: true}}).post(`${test.api}/${channelId}/my-messages`,{'text' : 'Hello'}); // test for POST channels/{channelId}/my-messages
 });

 it(`should allow GET /{test.api}/:channelId/history api`, () => {
   cloud.withOptions({qs: {private: true}}).get(`${test.api}/${channelId}/history`);
  });
  test.withApi(`${test.api}/${channelId}/history`).should.supportPagination();
  test.withApi(`${test.api}/${channelId}/history`).withOptions({qs : { 'where' : 'count = 1 '}}).should.return200OnGet();

  // define all supported actions and payloads
  const actions = [
 {'action': 'join', 'name': ''},
  {'action': 'read', 'ts': Date.parse(new Date())},
   {'action': 'leave'},
    {'action': 'archive'}
  ];
  const actions2=[
    {'action': 'unarchive'},
    {'action': 'rename', 'name': 'churros-check'+Date.parse(new Date())/10000},
    {'action': 'purpose','purpose': 'eat yummy churros'},
 {'action': 'topic','topic': 'tasty desserts'},
 {'action': 'leave'}
  ];
  it(`should allow GET /{test.api}`, () => {
     return cloud.withOptions({qs: {private: true}}).get(test.api)
     .then(r => actions[0].name = r.body[0].id );  //get a user for 'actions' apis
  });
    it(`should allow PATCH /{test.api}/:channelId/actions`, () => {
  actions.forEach( ac => (cloud.withOptions({qs: {private: true}}).patch(`${test.api}/${channelId}/actions`, ac)));
  actions2.forEach( ac => (cloud.withOptions({qs: {private: true}}).patch(`${test.api}/${channelId}/actions`, ac)));
      });

});
