'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/invitations');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('helpdesk', 'invitations', { payload: payload }, (test) => {

  var accountID;
  var invitationID;

  it('should GET the associated account', () => {
    return cloud.get('/hubs/helpdesk/accounts')
    .then(r => {accountID = r.body[0].id;});
  });

  it('should POST a new invitation in the account', () => {
    let temp = {"email": "test@test.com"};
    return cloud.post('/hubs/helpdesk/accounts/' + accountID + '/invitations', temp)
    .then(r => {invitationID = r.body.id; return r;})
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should GET all invitations from account', () => {
    return cloud.get('/hubs/helpdesk/accounts/' + accountID + '/invitations')
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should PUT invitation by ID', () => {
    let temp = {"role": "Collaborator"};
    return cloud.put('/hubs/helpdesk/invitations/' + invitationID, temp)
    .then(r => expect(r.body.role).to.eq("Collaborator"));
  });

  //CLEANUP FOLDER
  it('should delete the test invitation', () => {
    return cloud.delete('/hubs/helpdesk/invitations/' + invitationID)
    .then(r => expect(r).to.have.statusCode(200));
  });
});
