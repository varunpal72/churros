'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = {
  "firstName": "Tasty",
  "lastName": "Churros",
  "gender": "male",
  "emails": [{
    "value": tools.randomEmail()
  }]
};
const updatePayload = {
  "firstName": tools.random()
};

suite.forElement('helpdesk', 'users', { payload: payload }, (test) => {
  it(`should allow allow CRUS for ${test.api} and S for ${test.api}/{userId}/incidents`, () => {
    let userId;
    return cloud.post(test.api, payload)
      .then(r => cloud.get(`${test.api}`))
      .then(r => userId = r.body.filter(function(user) {
        return user.emails ? user.emails.length ? user.emails[0] === payload.emails[0].value : false : false;
      })[0].id)
      .then(r => cloud.patch(`${test.api}/${userId}`, updatePayload))
      .then(r => cloud.get(`${test.api}/${userId}`))
      .then(r => cloud.get(`${test.api}/${userId}/incidents`));
  });

  it(`should allow paginating with page ${test.api}`, () => {
    return cloud.withOptions({ qs: { page: 1 } }).get(test.api);
  });

  it(`should support searching ${test.api} by firstName`, () => {
    return cloud.withOptions({ qs: { where: `firstName='${updatePayload.firstName}'` } }).get(test.api);
  });

  it(`should allow paginating with page and searching ${test.api} by lastName`, () => {
    return cloud.withOptions({ qs: { page: 1, where: `lastName='${payload.lastName}'` } }).get(test.api);
  });
});
