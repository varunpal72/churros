// 'use strict';
//
// const suite = require('core/suite');
// // const payload = require('./assets/channels');
// const cloud = require('core/cloud');
//
// suite.forElement('collaboration', 'messages', { payload: 'blah' }, (test) => {
//   // check channel create (generally skip this one)
//   test.withOptions({skip:true}).should.return200OnPost();
//   test.should.supportSr();
//
//   it('should allow PATCH on public channels for all actions', () => {
//     return cloud.get(test.api)
//     .then(response => response.body.filter(channel => channel.name === 'churros-test-channel'))
//     .then(channels => {
//       // console.log(channels);
//       if (channels.length > 0) {return channels[0];}
//       else {return cloud.post(test.api, createPayload);}
//     })
//     .then(r => {
//       console.log(r);
//       cloud.update(`${test.api}/${r.id}/actions`, {action: 'rename', name: 'churros-check'});
//     })
//     .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'purpose', purpose: 'eat yummy churros'}))
//     .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'topic', name: 'tasty desserts'}))
//     .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'archive'}))
//     .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'unarchive'}))
//     .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'leave'}))
//     .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'join', name: 'churros-check'}))
//     .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'read', ts: 1412341512.123410}))
//     .then(r => cloud.update(`${test.api}/${r.id}/actions`, {action: 'rename', name: 'churros-test-channel'}));
//   });
//
// });
