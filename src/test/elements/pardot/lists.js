'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/lists');
const contactPayload = require('./assets/contacts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, contactPayload, overrides);
const contactPayload1 = build({ email: tools.randomEmail() });

contactPayload.email = tools.randomEmail();

suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');

  it('should allow CRUDS for lists/{id}/contacts', () => {
    let listId, listContactPayload,contactId;
    return cloud.post(test.api, payload)
      .then(r => listId = r.body.id)
      .then(r => cloud.post(`/hubs/marketing/contacts`, contactPayload1))
      .then(r => contactId = r.body.id)
      .then(r => listContactPayload = [{ "id": contactId }])
      .then(r => cloud.post(`${test.api}/${listId}/contacts`, listContactPayload))
      .then(r => cloud.get(`${test.api}/${listId}/contacts`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${listId}/contacts`))
      .then(r => cloud.get(`${test.api}/${listId}/contacts/${contactId}`))
      .then(r => cloud.patch(`${test.api}/${listId}/contacts/${contactId}`, contactPayload))
      .then(r => cloud.delete(`${test.api}/${listId}/contacts/${contactId}`))
      .then(r => cloud.delete(`/hubs/marketing/contacts/${contactId}`))
      .then(r => cloud.delete(`${test.api}/${listId}`));
  });
});
