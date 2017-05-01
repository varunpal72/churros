'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const activities = require('./assets/activities');
const notes = require('./assets/notes');
const tasks = require('./assets/tasks');
const cloud = require('core/cloud');

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
  test.should.supportCruds();
  test.should.supportPolling();
  test.should.return404OnGet('0');
  it('should allow CRUDS for /hubs/crm/accounts/:id/activites', () => {
    let accountId;
    return cloud.post(test.api, payload)
      .then(r => accountId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${accountId}/activities`, activities))
      .then(r => cloud.delete(`${test.api}/${accountId}`));
  });
  it('should allow CRUDS for /hubs/crm/accounts/:id/notes', () => {
    let accountId;
    return cloud.post(test.api, payload)
      .then(r => accountId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${accountId}/notes`, notes))
      .then(r => cloud.delete(`${test.api}/${accountId}`));
  });
  it('should allow CRUDS for /hubs/crm/accounts/:id/tasks', () => {
    let accountId;
    return cloud.post(test.api, payload)
      .then(r => accountId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${accountId}/tasks`, tasks))
      .then(r => cloud.delete(`${test.api}/${accountId}`));
  });
});
