'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/lists');
const ListscontactsPayload = require('./assets/listsContacts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const listPayload = build({ Name: tools.random() });

suite.forElement('marketing', 'lists', { payload: listPayload }, (test) => {

  it(`should support CRUDS for ${test.api}`, () => {
    let updatePayload = {
      "Name": tools.random()
    };
    let listID;
    return cloud.post(test.api, listPayload)
      .then(r => listID = r.body.ID)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: 'CreatedAt =\'2017-01-19\'' } }).get(test.api))
      .then(r => cloud.get(`${test.api}/${listID}`))
      .then(r => cloud.patch(`${test.api}/${listID}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${listID}`));
  });

  it(`should allow CRUDS for /lists/id/contacts`, () => {
    let updatePayload = {
      "Name": tools.random()
    };
    let listId, contactId;
    return cloud.post(test.api, listPayload)
      .then(r => listId = r.body.ID)
      .then(r => cloud.get(`${test.api}/${listId}/contacts/`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${listId}/contacts/`))
      .then(r => cloud.withOptions({ qs: { where: 'UnsubscribedAt =\'2017-01-19\'' } }).get(`${test.api}/${listId}/contacts/`))
      .then(r => cloud.post(`${test.api}/${listId}/contacts/`, ListscontactsPayload))
      .then(r => { contactId = r.body[0].ContactID; })
      .then(r => cloud.get(`${test.api}/${listId}/contacts/${contactId}`))
      .then(r => cloud.delete(`${test.api}/${listId}/contacts/${contactId}`));
    UnsubscribedAt
  });
});
