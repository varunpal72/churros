'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/accounts');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('helpdesk', 'accounts', { payload: payload }, (test) => {

  var accountID;
  var attachmentID;

  it('should get the associated organization', () => {
    return cloud.get('/hubs/helpdesk/accounts')
    .then(r => {accountID = r.body[0].id;});
  });

  it('should allow GET all', () => {
    return cloud.get('/hubs/helpdesk/accounts/' + accountID + '/attachments')
    .then(r => {attachmentID = r.body[0].id; return r;})
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should allow GET by id', () => {
    return cloud.get('/hubs/helpdesk/attachments/' + attachmentID)
    .then(r => expect(r.body.id).to.eq(attachmentID));
  });

  it('should allow GET download url', () => {
    return cloud.get('/hubs/helpdesk/attachments/' + attachmentID + '/url')
    .then(r => expect(r).to.have.statusCode(200));
  });
});
