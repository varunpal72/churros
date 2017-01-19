'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const userPayload = require('./assets/users');

suite.forElement('marketing', 'users', { payload: userPayload }, (test) => {
  const build = (overrides) => Object.assign({}, userPayload, overrides);
  const payload = build({ email: tools.randomEmail() });

  const updatePayload = {
    "email": "xyz@yahoo.com"
  };

  it('should support CRUS for users', () => {
    let userSid;
    return cloud.post(test.api, payload)
      .then(r => userSid = r.body.keys.sid)
      .then(r => cloud.withOptions({ qs: { where: `sid= \'${userSid}\'` } }).get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${userSid}`))
      .then(r => cloud.patch(`${test.api}/${userSid}`, updatePayload));
  });
});
