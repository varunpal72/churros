'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const contactPayload = require('./assets/contacts');
const contactUpdatePayload = require('./assets/contactsUpdate');
const cloud = require('core/cloud');
const tools = require('core/tools');
payload.listname = tools.random();

suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
  test.should.supportCrds();

  it('it should support GET all contacts inside a list', () => {
    return cloud.get('/hubs/marketing/lists')
    .then(r => r.body.filter(r => r.id))
    .then(filteredLists => cloud.get(`/hubs/marketing/lists/${filteredLists[0].id}/contacts`));
  });

  it('it should support POST a contact inside a list', () => {
    return cloud.get('/hubs/marketing/lists')
    .then(r => r.body.filter(r => r.id))
    .then(filteredLists => cloud.post(`/hubs/marketing/lists/${filteredLists[0].id}/contacts`, contactPayload));
  });

  it('it should support GET a contact inside a list', () => {
    let filteredLists;

    return cloud.get('/hubs/marketing/lists')
    .then(r => r.body.filter(r => r.id))
    .then(fi => filteredLists = fi)
    .then(() => cloud.post(`/hubs/marketing/lists/${filteredLists[0].id}/contacts`, contactPayload))
    .then(contacts => cloud.get(`/hubs/marketing/lists/${filteredLists[0].id}/contacts/${contacts.body[0].id}`));
  });

  it('it should support PATCH a contact inside a list', () => {
    let filteredLists;

    return cloud.get('/hubs/marketing/lists')
    .then(r => r.body.filter(r => r.id))
    .then(fi => filteredLists = fi)
    .then(() => cloud.post(`/hubs/marketing/lists/${filteredLists[0].id}/contacts`, contactPayload))
    .then(contacts => cloud.patch(`/hubs/marketing/lists/${filteredLists[0].id}/contacts/${contacts.body[0].id}`, contactUpdatePayload));
  });

  it('it should support DELETE a contact inside a list', () => {
    let filteredLists;

    return cloud.get('/hubs/marketing/lists')
    .then(r => r.body.filter(r => r.id))
    .then(fi => filteredLists = fi)
    .then(() => cloud.post(`/hubs/marketing/lists/${filteredLists[0].id}/contacts`, contactPayload))
    .then(contacts => cloud.delete(`/hubs/marketing/lists/${filteredLists[0].id}/contacts/${contacts.body[0].id}`));
  });

});
