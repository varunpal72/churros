'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const schema = require('./assets/users.schema');
const expect = require('chai').expect;
const payload = {
  firstName: 'frank',
  lastName: 'ricard',
  email: 'frank@oldschool.com',
  password: 'Passw0rd!'
};
const updatePayload = {
  firstName: 'joseph',
  lastName: 'pulaski'
};

suite.forPlatform('users', { schema: schema, payload: payload }, (test) => {
  const cleanup = () => {
    return cloud.get(`/users`)
      .then(r => {
        const usersToDelete = r.body.filter(user => user.email === payload.email);
        return usersToDelete && usersToDelete[0] ?
          cloud.delete(`/users/${usersToDelete[0].id}`) :
          true;
      });
  };

  let accountId, userId;
  before(() => {
    return cleanup()
      .then(r => cloud.get(`/accounts`))
      .then(r => accountId = r.body.filter(account => account.defaultAccount)[0].id)
      .then(r => cloud.post(`/accounts/${accountId}/users`, payload, schema))
      .then(r => userId = r.body.id);
  });

  after(() => cleanup());

  it('should support CRUDS for users', () => {
    const validate = (r, amount, firstName, lastName) => {
      firstName = firstName || payload.firstName;
      lastName = lastName || payload.lastName;
      expect(r.body.length).to.be.above(0);
      expect(r.body.filter(user => user.firstName === firstName && user.lastName === lastName).length).to.equal(amount);
    };

    const validatePatch = (r) => {
      expect(r.body.firstName).to.equal(updatePayload.firstName);
      expect(r.body.lastName).to.equal(updatePayload.lastName);
      expect(r.body.email).to.equal(payload.email);
    };

    return cloud.get(`/users`)
      .then(r => validate(r, 1))
      .then(r => cloud.patch(`/users/${userId}`, Object.assign({}, payload, updatePayload)))
      .then(r => validatePatch(r))
      .then(r => cloud.delete(`/users/${userId}`))
      .then(r => cloud.get(`/users`))
      .then(r => validate(r, 0, updatePayload.firstName, updatePayload.lastName));
  });
});
