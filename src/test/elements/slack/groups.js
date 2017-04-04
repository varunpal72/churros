'use strict';

const tools=require('core/tools');
const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('collaboration','groups' ,(test) => {
///For this test, error is coming as 'paid teams only', even on vendor's api doc
const payload={
  'name' : tools.randomStr(),
  'description' : 'Group description'
};
it(`should allow POST {test.api}`,()=>{
  return cloud.post(test.api,payload);
});
// test for patch /groups/{groupId} api
let userGroupId;
let updatedPayload={
  'description' : tools.randomStr()
};
it(`should allow PATCH {test.api}/:userGroupId`,()=>{
  return cloud.get(test.api)
  .then (r => userGroupId = encodeURIComponent(r.body.usergroups[0].id))   //Need to check if this Id needs to be encoded and passed as path variable
  .then (r => cloud.patch(`${test.api}/${userGroupId}`,updatedPayload));
});

// test for 'actions' on group
let updatedActionsPayload=[
{  'action' : 'enable' },
{  'action' : 'disable' }];
it(`should allow PATCH {test.api}/:userGroupId/actions`,()=>{
  return cloud.get(test.api)
  .then (r => userGroupId = encodeURIComponent(r.body.usergroups[0].id))   //Need to check if this Id needs to be encoded and passed as path variable
  .then (r => updatedActionsPayload.forEach( mAction =>  cloud.patch(`${test.api}/${userGroupId}/actions`,mAction)));
});

//test for get and patch /groups/{groupId}/users api
let groupUserPayload={
  'users' : ''
};
it(`should allow PATCH {test.api}/:userGroupId/users`,()=>{
  return cloud.get(test.api)
  .then (r => userGroupId = encodeURIComponent(r.body.usergroups[0].id))  //Need to check if this Id needs to be encoded and passed as path variable
  .then (r => cloud.get(`${test.api}/${userGroupId}/users`))
  .then (r => groupUserPayload.users = encodeURIComponent(r.body.users[0]))
  .then (r => cloud.patch(`${test.api}/${userGroupId}/users`,groupUserPayload));
});



});
