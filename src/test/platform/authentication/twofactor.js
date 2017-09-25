'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const user = require('./assets/user.json');
const registeringUser = require('./assets/registeringUser.json');
const getOTP = require('./assets/totp').getOTP;
const {URL} = require('url');

let token, gaSecretCode;

suite.forPlatform('twofactor', (test) => {

  before(() => cloud.post('/signup', user, (r) => {}));

  it('authenticates with created user', () => {
      return cloud.post('/authentication', user)
      .then(r => token = r.body.token);

  });
  it('enables organization 2fa with Google Authenticator', () => cloud.withOptions({headers:{Authorization: 'Bearer ' + token }}).put('/organizations/two-factor/enabled', {"type":"GOOGLE_AUTHENTICATOR"}));

  it('authenticates with created 2fa user', () => {
      return cloud.post('/authentication', user)
      .then(r =>
      {
        expect(r.body.twoFactor).to.be.true;
        expect(r.body.twoFactorType).to.equal('GOOGLE_AUTHENTICATOR');
        expect(r.body.registeredForTwoFactor).to.be.true;
        token = r.body.token;
        gaSecretCode = r.body.googleAuthUri;
      });
    });

  it('posts code, generating it via totp algorithm', () => {
      const parsedUrl = new URL(gaSecretCode);
      const params = parsedUrl.searchParams;
      const code = getOTP(params.get('secret'));

      return cloud.withOptions({headers:{Authorization: 'Bearer ' + token }}).post('authentication/two-factor/code', {username:user.username, twoFactorAuthCode:code})
      .then(r => {
        token = r.body.token;
      });

  });

  it('enables 2fa via SMS' , () => cloud.withOptions({headers:{Authorization: 'Bearer ' + token }}).put('/organizations/two-factor/enabled',{"type": "SMS"}));

  it('authenticates with created 2fa user', () => {
      return cloud.post('/authentication', user)
      .then(r =>
      {
        expect(r.body.twoFactor).to.be.true;
        expect(r.body.twoFactorType).to.equal('SMS');
        expect(r.body.registeredForTwoFactor).to.be.false;
      });
    });

// Can enable these last two tests once we get a valid phone number to use

  xit('registers 2fa user via SMS', () => { // jshint ignore:line
  return cloud.withOptions({headers:{Authorization: 'Bearer ' + token }}).post('authentication/two-factor/registration', registeringUser)
  .then(r =>
  {
    expect(r.body.twoFactor).to.be.true;
    expect(r.body.twoFactorType).to.equal('SMS');
    expect(r.body.registeredForTwoFactor).to.be.false;
  });
});

 xit('authenticates with created 2fa user, expecting phone number on response', () => { // jshint ignore:line
      return cloud.post('/authentication', user)
      .then(r =>
      {
        expect(r.body.twoFactor).to.be.true;
        expect(r.body.twoFactorType).to.equal('SMS');
        expect(r.body.registeredForTwoFactor).to.be.false;
        expect(r.body.twoFactorPhoneNumber).to.equal('+1 972-360-9606');
      });
    });

    after(() => cloud.withOptions({headers:{Authorization: 'Bearer ' + token }}).delete('/organizations/two-factor/enabled'));

});
