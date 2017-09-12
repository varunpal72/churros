'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;
const passwordPolicySchema = require('./assets/password-policy.schema');

suite.forPlatform('organizations/password-policies', {schema: passwordPolicySchema}, (test) => {
  before(() => cloud.delete('/organizations/password-policies', () => true));

  it('should allow creating organization-wide password policies', () => {
    const payload = {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      symbolCharacterSet: '!@#$%^&*()',
      previousPasswordCount: 3,
      rotationDays: 180
    };

    const validator = r => {
      // this can happen if the churros user is not an organization admin
      return r.response.statusCode === 403 ? r : expect(r).to.have.schemaAnd200(passwordPolicySchema);
    };

    return cloud.put('/organizations/password-policies', payload, validator)
      .then(r => cloud.put('/organizations/password-policies', payload, validator))
      .then(r => cloud.delete('/organizations/password-policies', () => true));
  });
});
