'use strict';

const suite = require('core/suite');
const payload = require('./assets/channels');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const createPayload = { channel: 'churros-test-channel'};
const actions = {
  all: ["archive", "read", "rename", "purpose", "topic", "unarchive", "leave", "join"],
  private: [ "open", "close"]
};

suite.forElement('collaboration', 'channels', { payload: payload }, (test) => {
  // check channel create (generally skip this one)
  test.should.return200OnPost();
  test.should.supportSr();

  it('should allow PATCH on public channels for all actions', () => {
    let options = { qs: { action: actions.all[0] }};
    return cloud.get(test.api)
    .then(response => {
      return response.filter(function(channel){
        if (channel.name === 'churros-test-channel'){
          return channel;
        }
      });
    })
    .then(function (channels) {
      if (channels.length > 0) {
        return channels[0];
      } else {
        return cloud.post(test.api, createPayload);
      }
    })
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {qs: {action: 'rename', name: 'churros-check'}}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {qs: {action: 'purpose', purpose: 'eat yummy churros'}}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {qs: {action: 'topic', name: 'tasty desserts'}}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {qs: {action: 'archive'}}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {qs: {action: 'unarchive'}}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {qs: {action: 'leave'}}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {qs: {action: 'join', name: 'churros-check'}}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {qs: {action: 'read', ts: 1412341512.123410}}))
    .then(r => cloud.update(`${test.api}/${r.id}/actions`, {qs: {action: 'rename', name: 'churros-test-channel'}}));
  });

  it('should allow Create for private channels', () => {
    let privateNotPublic = true;
    return cloud.post('/path/to/resource', {options: "true?"})
      .then(r => cloud.cruds(test.api, payload(privateNotPublic)))
      .then(r => cloud.delete('/path/to/resource'));
  });

  test.should.return200OnPost();
  test.withOptions({qs: {private: true}}).should.return200OnPost();
  // check channel get all
  test.should.return200OnGet();
  test.withOptions({qs: {private: true}}).should.return200OnGet();
  // check


  it('lukevance should insert some tests here :)', () => true);
});
