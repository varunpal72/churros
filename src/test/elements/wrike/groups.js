'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/groups');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('helpdesk', 'groups', { payload: payload }, (test) => {

  var accountID;
  var groupID;

  it('should GET the associated account', () => {
    return cloud.get('/hubs/helpdesk/accounts')
    .then(r => {accountID = r.body[0].id;});
  });

  it('should POST a new group in the account', () => {
    let temp = {"title": "Test Group"};
    return cloud.post('/hubs/helpdesk/accounts/' + accountID + '/groups', temp)
    .then(r => {groupID = r.body.id; return r;})
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should GET all groups from account', () => {
    return cloud.get('/hubs/helpdesk/accounts/' + accountID + '/groups')
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should GET group by ID', () => {
    return cloud.get('/hubs/helpdesk/groups/' + groupID)
    .then(r => expect(r.body.id).to.eq(groupID));
  });

  it('should PUT group by ID', () => {
    let temp = {"title": "update group title"};
    return cloud.put('/hubs/helpdesk/groups/' + groupID, temp)
    .then(r => expect(r.body.title).to.eq("update group title"));
  });

  //CLEANUP FOLDER
  it('should delete the test group', () => {
    return cloud.delete('/hubs/helpdesk/groups/' + groupID)
    .then(r => expect(r).to.have.statusCode(200));
  });
});
