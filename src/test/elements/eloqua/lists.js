'use strict';

const suite = require('core/suite');
const contactsPayload = require('./assets/contacts');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/lists.json`);
const build = (overrides) => Object.assign({}, contactsPayload, overrides);
const contactUpdatePayload = build({ lastName: tools.random(), firstName: tools.random(), emailAddress: tools.randomEmail() });

contactsPayload.emailAddress = tools.randomEmail();

suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
  const opts = {
    churros: {
      updatePayload: {
        name: tools.random()
      }
    }
  };
  test.withOptions(opts).should.supportCruds();
  test.withOptions({ qs: { pageSize: 10 }}).should.supportPagination('id');
  test.should.supportCeqlSearch('id');

  it('should allow CRUDS for lists/{id}/contacts ', () => {
    let listId, contactId, contactPostPayload;
    return cloud.get(test.api)
      .then(r => listId = r.body[0].id)
      .then(r => cloud.post(`/hubs/marketing/contacts`, contactsPayload))
      .then(r => contactId = r.body.id)
      .then(r => contactPostPayload = [{ "id": contactId }])
      .then(r => cloud.post(`${test.api}/${listId}/contacts`, contactPostPayload))
      .then(r => cloud.get(`${test.api}/${listId}/contacts/${contactId}`))
      .then(r => cloud.patch(`${test.api}/${listId}/contacts/${contactId}`, contactUpdatePayload))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${listId}/contacts`))
      .then(r => cloud.withOptions({ qs: { where: `id= '${contactId}'` } }).get(`${test.api}/${listId}/contacts`))
      .then(r => cloud.delete(`${test.api}/${listId}/contacts/${contactId}`))
      .then(r => cloud.delete(`/hubs/marketing/contacts/${contactId}`));
  });
});
