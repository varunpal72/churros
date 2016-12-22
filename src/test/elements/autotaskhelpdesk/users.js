'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const usersPayload = require('./assets/users');
const contactPayload = require('./assets/contacts');

const updatePayload = {
  "userName": tools.random()
}

suite.forElement('helpdesk', 'users', { payload: usersPayload }, (test) => {
  const build = (overrides) => Object.assign({}, usersPayload, overrides);
  const payload = build({ userName: tools.random() });
  it(`should support paging, Ceql search and CRUDS for ${test.api}`, () => {
    let userId;
    return cloud.post('/hubs/helpdesk/contacts', contactPayload)
      .then(r => payload.contactID = r.body.id)
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => userId = r.body.id)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { where: 'clientPortalActive = True' } }).get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${userId}`))
      .then(r => cloud.patch(`${test.api}/${userId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${userId}`));
  });
});
