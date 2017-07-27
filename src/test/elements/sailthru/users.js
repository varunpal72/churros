'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/users.json`);

// Adding skip as there is no delete
suite.forElement('marketing', 'users', { payload: payload, skip: true }, (test) => {
  it('should support CRUS for users', () => {
    const updatePayload = {
      "email": "xyz@yahoo.com"
    };
    let userSid;
    return cloud.post(test.api, payload)
      .then(r => userSid = r.body.id)
      .then(r => cloud.withOptions({ qs: { where: `sid= \'${userSid}\'` } }).get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${userSid}`))
      .then(r => cloud.patch(`${test.api}/${userSid}`, updatePayload));
  });
});
