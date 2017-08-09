'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const defaults = require('core/defaults');
const expect = require('chai').expect;

suite.forPlatform('No events', (test) => {
  let subAccount;
  let user;

  const cloudAsUser = (user) => {
    const orgSecret = defaults.secrets().orgSecret;
    return user ? cloud.withOptions({headers:{authorization: `User ${user.secret}, Organization ${orgSecret}`}}) : cloud;
  };

  const deleteEntity = (name, nameKey, uri, user) => {
    return cloudAsUser(user).withOptions({qs: {where: `${nameKey}='${name}'`}}).get(uri)
      .then(r => Promise.all(r.body.filter(entity => entity[nameKey] === name)
        .map(entity => cloudAsUser(user).delete(`${uri}/${entity.id}`))), () => true);
  };

  const createEntity = (name, nameKey, uri, postUri, entity, user) => {
    return deleteEntity(name, nameKey, uri)
      .then(() => cloudAsUser(user).post(postUri, entity))
      .then(r => r.body);
  };

  const createAccount = accountName => {
    return createEntity(accountName, 'externalId', '/accounts', '/accounts', {externalId: accountName});
  };

  const deleteAccount = accountName => {
    return deleteEntity(accountName, 'externalId', '/accounts');
  };

  const createUser = (userEmail, account) => {
    return createEntity(
      userEmail,
      'email',
      '/users',
      `/accounts/${account.id}/users`,
      {email: userEmail,firstName: 'test',lastName: 'user',password: 'password'});
  };

  const deleteUser = (userEmail) => {
    return deleteEntity(userEmail, 'email', '/users');
  };

  before(() => {
    return createAccount('churros-subaccount')
      .then(r => subAccount = r)
      .then(() => createUser('churros-subaccount-user', subAccount))
      .then(r => user = r);
  });

  after(() => {
    return deleteUser('churros-subaccount-user')
      .then(() => deleteAccount('churros-subaccount'));
  });

  it('should properly handle no events found for GET /instances/events', () => {
    return cloudAsUser(user).get('/instances/events')
      .then(r => expect(r.body.length).to.equal(0));
  });

});