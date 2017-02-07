'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/users');
const contactPayload = require('./assets/contacts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);

suite.forElement('crm', 'users', { payload: payload }, (test) => {
  let userpayload;  
  it(`should support CRUS for /hubs/crm/users`, () => {
    let contactId,userId,userPayload;
    return cloud.post('/hubs/crm/contacts', contactPayload)
      .then(r => userPayload = build({ userName: tools.randomEmail(), contactID: r.body.id }))
      .then(r => cloud.post(test.api, userPayload))
      .then(r => userId = r.body.id)
      .then(r => cloud.get(`${test.api}/${userId}`))
      .then(r => cloud.patch(`${test.api}/${userId}`, userPayload))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: 'userName=\'mrchurros@cloud-elements.com\'' } }).get(test.api));
    });
});
