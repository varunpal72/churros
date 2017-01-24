'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('collaboration', 'users', null, (test) => {

  it(`should allow and SR for ${test.api} and GET account`, () => {
    let userId, userEmail;
    return cloud.get(`/hubs/collaboration/accounts`)
      .then(r => userId = r.body.id)
      .then(r => cloud.get(`${test.api}/${userId}`))
      .then(r => userEmail = r.body.emails[0])
      .then(r => cloud.withOptions({ qs: { where: `email='${userEmail}'` } }).get(test.api));
  });
});