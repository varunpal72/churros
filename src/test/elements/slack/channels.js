'use strict';

const suite = require('core/suite');
// const payload = require('./assets/channels');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const createPayload = { name: 'churros-test-channel'};
const actions = {
  all: ["archive", "read", "rename", "purpose", "topic", "unarchive", "leave", "join"],
  private: [ "open", "close"]
};

suite.forElement('collaboration', 'channels', { payload: createPayload }, (test) => {
  // check channel create (generally skip this one)
  test.withOptions({skip:true}).should.return200OnPost();
  test.should.supportSr();

// loop through actions + payloads
// call promise/test for each
// save channelId outside other calls

  it('should allow PATCH on public channels for all actions', () => {
    return cloud.get(test.api)
    .then(response => response.body.filter(channel => channel.name === 'churros-test-channel'))
    .then(channels => {
      // console.log(channels);
      if (channels.length > 0) {return channels[0];}
      else {return cloud.post(test.api, createPayload);}
    })
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'rename', name: 'churros-check'}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'purpose', purpose: 'eat yummy churros'}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'topic', name: 'tasty desserts'}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'archive'}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'unarchive'}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'leave'}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'join', name: 'churros-check'}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'read', ts: 1412341512.123410}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'rename', name: 'churros-test-channel'}));
  });

  // set new "it" cases for each action so as to know which is failing0

  // it('should allow Create for private channels', () => {
  //   let privateNotPublic = true;
  //   return cloud.post('/path/to/resource', {options: "true?"})
  //     .then(r => cloud.cruds(test.api, payload(privateNotPublic)))
  //     .then(r => cloud.delete('/path/to/resource'));
  // });
  //
  // test.should.return200OnPost();
  // test.withOptions({qs: {private: true}}).should.return200OnPost();
  // // check channel get all
  // test.should.return200OnGet();
  // test.withOptions({qs: {private: true}}).should.return200OnGet();
  // // check

  it('lukevance should insert some tests here :)', () => true);
});
