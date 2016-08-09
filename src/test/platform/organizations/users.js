'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;
const user = require('./assets/user');
const userSchema = require('./assets/user.schema');
const usersSchema = require('./assets/users.schema');

suite.forPlatform('organizations/users', {payload: user, schema: userSchema}, (test) => {
  test.should.supportCrd();
  test.should.return404OnDelete(-1);
  test.should.return404OnGet(-1);

  it('should throw a 409 when trying to create a duplicate user', () => {
    let userId;
    return cloud.post('/organizations/users', user)
    .then(r => userId = r.body.id)
    .then(() => test.should.return409OnPost());
  });

  it('should support getting a user by query', () => {
    let userId;
    return cloud.post('/organizations/users', user)
    .then(r => userId = r.body.id)
    .then(() => cloud.get('/organizations/users?where=firstName=\'churros\''))
    .then(r => expect(r.body).to.have.length(1) && expect(r.body[0].firstName).to.equal('churros'));
  });

  suite.forPlatform('organizations/users', {payload: user, schema: usersSchema}, (test) => {
    test.should.supportS();
  });

  suite.forPlatform('organizations/users', {payload: {}}, (test) => {
    test.should.return400OnPost();
  });

  afterEach(() => {
    return chakram.get(`/organizations/users/${user.email}`)
    .then(r => chakram.delete(`/organizations/users/${r.body.id}`));
  });

});
