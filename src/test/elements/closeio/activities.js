'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const account = require('./assets/account');
const activityPost = require('./assets/activityPost');
const activityPatch = require('./assets/activityPatch');

suite.forElement('crm', 'activities', (test) => {
  it(`should allow CUDS for /hubs/crm/accounts/{id}/activities`, () => {
    let accountId, activityId;
    return cloud.post(`/hubs/crm/accounts`, account)
      .then(r => accountId = r.body.id)
      .then(r => cloud.withOptions({ qs: { activityType: `email` } }).post(`/hubs/crm/accounts/${accountId}/activities`, activityPost))
      .then(r => activityId = r.body.id)
      .then(r => cloud.withOptions({ qs: { activityType: `email` } }).patch(`/hubs/crm/accounts/${accountId}/activities/${activityId}`, activityPatch))
      .then(r => cloud.get(`/hubs/crm/accounts/${accountId}/activities`))
      .then(r => cloud.withOptions({ qs: { activityType: `email` } }).delete(`/hubs/crm/accounts/${accountId}/activities/${activityId}`))
      .then(r => cloud.delete(`/hubs/crm/accounts/${accountId}`));
  });
});
