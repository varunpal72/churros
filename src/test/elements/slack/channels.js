'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const createPayload = { name: 'churros-test-channel'};

suite.forElement('collaboration', 'channels', { payload: createPayload }, (test) => {
  // check create and retrieve for public channels
  test.withOptions({skip:true}).should.return200OnPost();
  test.should.supportSr();
  // check create and retrieve for private channels
  test.withOptions({skip:true, qs: {private: true}}).should.return200OnPost();
  test.withOptions({ qs: {private: true}}).should.supportSr();
  // define all supported actions and payloads
  const actions = [
    {action: 'rename', name: 'churros-check'},
    {action: 'purpose', purpose: 'eat yummy churros'},
    {action: 'topic', name: 'tasty desserts'},
    {action: 'archive'},
    {action: 'unarchive'},
    {action: 'leave'},
    {action: 'join', name: 'churros-check'},
    {action: 'read', ts: 1412341512.123410},
    {action: 'rename', name: 'churros-test-channel'}
  ];

  // define test template for each action
  let actionTest = function (testName, channelId, payload, privateChannel){
    it(testName, () => {
      return cloud.withOptions({qs: {private: privateChannel}}).update(`${test.api}/` + channelId + '/actions', payload);
    });
  };
  // save channelId outside other calls
  let churrosChannelId = '';
  // retrieve
  it('should retrieve or create churros-test-channel', () => {
    return cloud.get(test.api)
    .then(response => response.body.filter(channel => channel.name === 'churros-test-channel'))
    .then(channels => {
      // console.log(channels);
      if (channels.length > 0) {return channels[0];}
      else {return cloud.post(test.api, createPayload);}
    })
    .then(channel => {
      churrosChannelId = channel.id;
    });
  });
  // call test function for each public channel action
  actions.forEach(action => actionTest(action.testName, churrosChannelId, action.payload, false));

  // define additional private channel actions
  const privateActions = [
    {action: "close"},
    {action: "open"}
  ];
  // call test function for each private channel action
  actions.forEach(action => actionTest(action.testName, churrosChannelId, action.payload, true));
  privateActions.forEach(action => actionTest(action.testName, churrosChannelId, action.payload, true));

  // Check to return history
  it('should retrieve history for public channels', () => {
    return cloud.get(`${test.api}/` + churrosChannelId + `/history`);
  });
  it('should retrieve history for private channels', () => {
    return cloud.withOptions({qs: {private: true}}).get(`${test.api}/` + churrosChannelId + `/history`);
  });

  // check to invite and kick a user
  it('should invite a user to a channel', () => {
    return cloud.get(`/users`);
    //get all channels
    // save user number from channel (that is NOT creator)
    // kick out of channel
    // invite back to channel
  });

});
