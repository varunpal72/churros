'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const cloud = require('core/cloud');
const tools = require('core/tools');

const updatePayload = () => ({
  "visibility": "pub",
  "default_from_email": "ze-churros@cloud-elements.com",
  "use_awesomebar": true,
  "name": "Churros update the list",
  "permission_reminder": "Because churros"
});

const contactPayload = () => ({
  "status": "pending",
  "email_address": tools.randomEmail().toString()
});

const contactUpdate = () => ({
  "status": "cleaned"
});

const fieldsPayload = () => ({
  "name": "churros",
  "type": "text"
});

const fieldsUpdate = () => ({
  "name": "churros update",
  "type": "text"
});

const options = {
  churros: {
    updatePayload: updatePayload()
  }
};

suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { where: 'since_date_created=\'2016-01-23T17:55:00+00:00\'' } }).should.return200OnGet();

  it('should allow S for list/{id}/activites', () => {
    let listId = -1;
    return cloud.get(test.api)
      .then(r => listId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${listId}/activities`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${listId}/activities`));
  });

  it('should allow CRUDS for lists/{id}/contacts', () => {
    let listId = -1;
    let contactId = -1;
    return cloud.post(test.api, payload)
      .then(r => listId = r.body.id)
      .then(r => cloud.post(`${test.api}/${listId}/contacts`, contactPayload()))
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(`${test.api}/${listId}/contacts/${contactId}`))
      .then(r => cloud.patch(`${test.api}/${listId}/contacts/${contactId}`, contactUpdate()))
      .then(r => cloud.post(`${test.api}/${listId}/contacts`, contactPayload()))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${listId}/contacts`))
      .then(r => cloud.withOptions({ qs: { where: 'status=\'cleaned\'' } }).get(`${test.api}/${listId}/contacts`))
      .then(r => cloud.delete(`${test.api}/${listId}/contacts/${contactId}`))
      .then(r => cloud.delete(`${test.api}/${listId}`));
  });
  it('should allow CRUDS for lists/{id}/fields', () => {
    let listId = -1;
    let fieldId = -1;
    return cloud.post(test.api, payload)
      .then(r => listId = r.body.id)
      .then(r => cloud.post(`${test.api}/${listId}/fields`, fieldsPayload()))
      .then(r => fieldId = r.body.merge_id)
      .then(r => cloud.get(`${test.api}/${listId}/fields/${fieldId}`))
      .then(r => cloud.patch(`${test.api}/${listId}/fields/${fieldId}`, fieldsUpdate()))
      .then(r => cloud.post(`${test.api}/${listId}/fields`, fieldsPayload()))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${listId}/fields`))
      .then(r => cloud.withOptions({ qs: { where: 'type=\'text\'' } }).get(`${test.api}/${listId}/fields`))
      .then(r => cloud.delete(`${test.api}/${listId}/fields/${fieldId}`))
      .then(r => cloud.delete(`${test.api}/${listId}`));
  });
});
