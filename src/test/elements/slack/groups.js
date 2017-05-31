'use strict';

const tools = require('core/tools');
const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = {
  'name': tools.randomStr(),
  'description': 'Group description'
};

suite.forElement('collaboration', 'groups', { skip: true }, (test) => {
  ///For this test, error is coming as 'paid teams only', even on vendor's api doc
  let userGroupId;
  before(() => cloud.post(test.api, payload)
    .then(r => userGroupId = r.body.id));

  let disableAction = { 'action': 'disable' };
  after(() => cloud.patch(`${test.api}/${userGroupId}`, disableAction));

  // test for patch /groups/{groupId} api
  it(`should allow PATCH ${test.api}/:userGroupId`, () => {
    let updatedPayload = {
      'description': tools.randomStr()
    };
    return cloud.get(test.api)
      // .then(r => userGroupId = encodeURIComponent(r.body.usergroups[0].id)) //Need to check if this Id needs to be encoded and passed as path variable
      .then(r => cloud.patch(`${test.api}/${userGroupId}`, updatedPayload)); //TODO test - should be using the before
  });

  // test for 'actions' on group
  let updatedActionsPayload = [
    { 'action': 'enable' },
    { 'action': 'disable' }
  ];
  it(`should allow PATCH ${test.api}/:userGroupId/actions`, () => {
    return cloud.get(test.api)
      .then(r => userGroupId = encodeURIComponent(r.body.usergroups[0].id)) //Need to check if this Id needs to be encoded and passed as path variable
      .then(r => updatedActionsPayload.forEach(mAction => cloud.patch(`${test.api}/${userGroupId}/actions`, mAction)));
  });

  //test for get and patch /groups/{groupId}/users api
  let groupUserPayload = {
    'users': ''
  };
  it(`should allow PATCH ${test.api}/:userGroupId/users`, () => {
    return cloud.get(test.api)
      .then(r => userGroupId = encodeURIComponent(r.body.usergroups[0].id)) //Need to check if this Id needs to be encoded and passed as path variable
      .then(r => cloud.get(`${test.api}/${userGroupId}/users`))
      .then(r => groupUserPayload.users = encodeURIComponent(r.body.users[0]))
      .then(r => cloud.patch(`${test.api}/${userGroupId}/users`, groupUserPayload));
  });



});