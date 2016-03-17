'use strict';

const suite = require('core/suite');
const payload = require('./assets/members');
const cloud = require('core/cloud');

let memberId;
// member is unsuspended twice to make sure it's in a state where it can be tested next time.
suite.forElement('documents', 'members', payload, (test) => {
  it('should support CRUDS for members', () =>{
    return cloud.post(test.api, payload)
    .then(r => {
    	let memberStr = r.body.complete[0].profile.team_member_id;
    	memberId = memberStr.split(":")[1];
      })
    .then(r => cloud.delete(`${test.api}/${memberId}`))
    .then (r => cloud.get(test.api)
    .then(r => {
    	let record = r.body[r.body.length-1];
    	memberId = record.profile.team_member_id.split(":")[1];
    })
    .then(r => cloud.get(`${test.api}/${memberId}`))
    .then(r => cloud.patch(`${test.api}/${memberId}/suspend/false`))
    .then(r => cloud.patch(`${test.api}/${memberId}/unsuspend`))
    .then(r => cloud.patch(`${test.api}/${memberId}/suspend`))
    .then(r => cloud.patch(`${test.api}/${memberId}/unsuspend`))
  });
});
