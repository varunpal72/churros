'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/accounts');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('helpdesk', 'accounts', { payload: payload }, (test) => {

  var accountID;

  it('should allow GET all', () => {
    return cloud.get('/hubs/helpdesk/accounts')
    .then(r => {accountID = r.body[0].id;return r;})
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should allow GET by id', () => {
    return cloud.get('/hubs/helpdesk/accounts/' + accountID)
    .then(r => expect(r.body.id).to.eq(accountID));
  });
});
