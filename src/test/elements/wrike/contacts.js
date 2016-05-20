'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('helpdesk', 'contacts', { payload: payload }, (test) => {

  var contactID;

  it('should allow GET all', () => {
    return cloud.get('/hubs/helpdesk/contacts')
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should allow GET by current user', () => {
    let query = {"Current User": true};
    return cloud.withOptions({ qs: query }).get('/hubs/helpdesk/contacts')
    .then(r => {contactID = r.body[0].id; return r;})
    .then(r => expect(r).to.have.statusCode(200));
  });

  it('should allow GET by contact id', () => {
    return cloud.get('/hubs/helpdesk/contacts/' + contactID)
    .then(r => expect(r.body.id).to.eq(contactID));
  });
});
