'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;
const passwordPolicySchema = require('./assets/password-policy.schema');

suite.forPlatform('organizations/password-policies', {schema: passwordPolicySchema}, test => {
  const cleanup = () => {
    return cloud.delete('/organizations/password-policies', () => true)
      .then(() => cloud.get(`/organizations/users`))
      .then(r => {
        const usersToDelete = r.response.body.filter(user => user.firstName === 'churros');
        const promises = usersToDelete.map(user => cloud.delete(`/organizations/users/${user.id}`));
        return Promise.all(promises);
      });
  };

  before(cleanup);
  after(cleanup);

  const buildUser = password => ({ email: 'fakeuser@churros.com', firstName: 'churros', lastName: 'bigsby', password });

  const shouldBe200 = r => expect(r).to.have.statusCode(200) ;
  const shouldBe200WithSchema = r => expect(r).to.have.schemaAnd200(passwordPolicySchema) ;
  const shouldBe400WithMessage = msg => r => {
    expect(r).to.have.statusCode(400);
    expect(r.response.body.message).to.contain(msg);
  };

  const attemptUsersWithBadPasswords = () => {
    return cloud.post('/organizations/users', buildUser('short'), shouldBe400WithMessage('at least'))
      .then(r => cloud.post('/organizations/users', buildUser('MissingNumber!'), shouldBe400WithMessage('numeric')))
      .then(r => cloud.post('/organizations/users', buildUser('nouppercase1!'), shouldBe400WithMessage('uppercase')))
      .then(r => cloud.post('/organizations/users', buildUser('NOLOWERCASE1!'), shouldBe400WithMessage('lowercase')))
      .then(r => cloud.post('/organizations/users', buildUser('Churros1!'), shouldBe400WithMessage('first name')))
      .then(r => cloud.post('/organizations/users', buildUser('Bigsby1!'), shouldBe400WithMessage('last name')))
      .then(r => cloud.post('/organizations/users', buildUser('Fakeuser1!'), shouldBe400WithMessage('username')))
      .then(r => cloud.post('/organizations/users', buildUser('NoSymbols1'), shouldBe400WithMessage('special character')))
      .then(r => cloud.post('/organizations/users', buildUser('IAmGood1!'), shouldBe200));
  };

  it('should validate new users against the default CE password policy', () => attemptUsersWithBadPasswords());

  it('should allow creating organization-wide password policies', () => {
    const passwordPolicy = {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      symbolCharacterSet: '!@#$%^&*()',
      previousPasswordCount: 3,
      rotationDays: 180,
    };

    return cloud.put('/organizations/password-policies', passwordPolicy, shouldBe200WithSchema)
      .then(attemptUsersWithBadPasswords)
      .then(r => cloud.post('/organizations/users', buildUser('SymbolsNotInCharacterSet1?'), shouldBe400WithMessage('special character')));
  });
});
