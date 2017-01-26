'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/users');
const build = (overrides) => Object.assign({}, payload, overrides);
const userPayload = build({ email: tools.randomEmail() });
// Adding skip as there is no delete
suite.forElement('marketing', 'users', { payload: userPayload, skip: true }, (test) => {
  it('should support CRUS for users', () => {
    const updatePayload = {
      "email": "xyz@yahoo.com"
    };
    let userSid;
    return cloud.post(test.api, userPayload)
      .then(r => userSid = r.body.id)
      .then(r => cloud.withOptions({ qs: { where: `sid= \'${userSid}\'` } }).get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${userSid}`))
      .then(r => cloud.patch(`${test.api}/${userSid}`, updatePayload));
  });
});