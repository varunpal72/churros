'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/lists');
const chakram = require('chakram');
const expect = chakram.expect;

const contactPayload = (email) => ({
  "FirstName": "Mr.",
  "LastName": "Churro",
  "Email": email
});

suite.forElement('marketing', 'lists', { payload: payload, skip: true }, (test) => {
  let testListId;
  before(() => {
    return cloud.get(test.api)
      .then(r => {
        var match = r.body.filter(function(list) {
          return list.title === 'Test List';
        });
        if (match.length === 1) {
          testListId = match[0].listId;
        } else {
          // bail
        }
      });
  });
  it('should allow cursor pagination for /hubs/marketing/lists/{id}/contacts', () => {
    const options = { qs: { pageSize: 100 } };
    return cloud.withOptions(options).get(`${test.api}/${testListId}/contacts`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`${test.api}/${testListId}/contacts`);
      });
  });
  it('should allow CS for /hubs/marketing/lists and CDS for lists/{id}/contacts', () => {
    let email = tools.randomEmail().toString();
    let contactId = -1;
    let listId = -1;
    return cloud.post(test.api, payload)
      .then(r => listId = r.body.listId)
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.post('/hubs/marketing/contacts', contactPayload(email)))
      .then(r => contactId = r.body.id)
      .then(r => cloud.post(`${test.api}/${listId}/contacts/${contactId}`))
      .then(r => cloud.get(`${test.api}/${listId}/contacts`))
      .then(r => cloud.delete(`${test.api}/${listId}/contacts/${contactId}`));
  });
});
