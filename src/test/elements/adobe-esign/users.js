'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = chakram.expect;

const createUsers = () => ({
  "lastName": tools.random(),
  "email": tools.randomEmail(),
  "firstName": tools.random()

});

const updateUsers = (groupId) => ({
  "lastName": "Lindahl",
  "groupId": "3AAABLblqZhAnEZAAp67NQsRPNvathlzHF82VbQuf5SsWIAW66k94p7hA5KU3jeBxg5rZaaMtaMXt817L8bXCQXoqQqhM26lY",
  "title": tools.random(),
  "phone": "866.830.3456",
  "email": "greg@cloud-elements.com",
  "roles": [
    "GROUP_ADMIN",
    "ACCOUNT_ADMIN"
  ],
  "company": "Cloud Elements",
  "firstName": "Greg"
});

suite.forElement('esignature', 'users', null, (test) => {
  let userId;
  it('should allow GET for ' + test.api, () => {
    return cloud.get(test.api)
      .then(r => expect(r).to.have.statusCode(200))
  });
  it('should allow POST for ' + test.api, () => {
    return cloud.post(test.api, createUsers())
      .then(r => expect(r).to.have.statusCode(200))
  });
  it('should allow GET for ' + test.api + '/{userId}', () => {
    return cloud.post(test.api, createUsers())
      .then(r => userId = r.body.id)
      .then(r => cloud.get(test.api + '/' + userId))
      .then(r => expect(r).to.have.statusCode(200))
  });
  it('should allow PUT for ' + test.api + '/{userId}', () => {
    return cloud.get(test.api)
      .then(r => userId = r.body[0].id)
      .then(r => cloud.put(test.api + '/' + userId, updateUsers()))
      .then(r => expect(r).to.have.statusCode(200))
  });
});
