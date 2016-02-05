/* MOCKING OUT THE core/oauth module here */
const mockery = require('mockery');
mockery.registerMock('core/oauth', () => 'http://snoopaloopredirecturl.com/redirecter?code=speakercity&oauth_verifier=josephbluepulaski');
mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
});
const provisioner = require('core/provisioner');
mockery.disable();
/****************************************/

require('core/assertions');
const chakram = require('chakram');
const expect = chakram.expect;
const nock = require('nock');
const props = require('core/props');
const defaults = require('core/defaults');

const auth = 'User fake, Organization fake';
const headers = () => new Object({ reqheaders: { 'Authorization': (value) => value === auth } });
const baseUrl = 'https://api.cloud-elements.com/elements/api-v2;';

/** Before each because we run all of the unit tests at once and initializing some of these things
in multiple before blocks breaks things. I prefer them to be self-contained as opposed to a global
before or something like that ... */
beforeEach(() => {
  defaults(baseUrl, 'fake', 'fake');

  /** Has to be in before each with current approach: https://github.com/pgte/nock#specifying-hostname **/
  nock(baseUrl, headers())
    .post('/instances')
    .reply(200, (uri, requestBody) => {
      requestBody.id = 123;
      return requestBody;
    })
    .delete('/instances/123')
    .reply(200);

  nock(baseUrl, headers())
    .get('/elements/myoauth1element/oauth/token')
    .query(true)
    .reply(200, () => new Object({
      token: 'token',
      secret: 'secret'
    }));

  nock(baseUrl, headers())
    .get('/elements/myoauth1element/oauth/url')
    .query(true)
    .reply(200, () => new Object({
      oauthUrl: 'http://frankthetanksoauthurl.com'
    }));

  nock(baseUrl, headers())
    .get('/elements/myoauth2element/oauth/url')
    .query(true)
    .reply(200, () => new Object({
      oauthUrl: 'http://frankthetanksoauthurl.com'
    }));
});

const setupProps = () => {
  props({
    'oauth.callback.url': 'http://myfakecallbackurl',
    'myelement': {
      'username': 'frank',
      'password': 'ricard'
    },
    'myoauth1element': {
      'provisioning': 'oauth1',
      'username': 'frank',
      'password': 'ricard',
      'oauth.api.key': 'he gon do one',
      'oauth.api.secret': 'fill it up again',
      'oauth.request.url': 'through the quad, up to the gymnasium'
    },
    'myoauth2element': {
      'provisioning': 'oauth2',
      'username': 'frank',
      'password': 'ricard',
      'oauth.api.key': 'he gon do one',
      'oauth.api.secret': 'fill it up again'
    }
  });
};

describe('provisioner', () => {
  it('should allow creating a standard element instance', () => {
    setupProps();
    return provisioner.create('myelement')
      .then(r => {
        expect(r).not.to.be.null;
        expect(r.body).not.to.be.null;
        expect(r.body.id).to.equal(123);
      });
  });

  it('should allow creating an oauth1 element instance', () => {
    setupProps();
    return provisioner.create('myoauth1element')
      .then(r => {
        expect(r).not.to.be.null;
        expect(r.body).not.to.be.null;
        expect(r.body.id).to.equal(123);
        expect(r.body.providerData).not.to.be.null;
        expect(r.body.providerData.secret).to.equal('secret');
        expect(r.body.providerData.oauth_verifier).to.equal('josephbluepulaski');
      })
      .then(r => mockery.disable());
  });

  it('should throw an error if oauth1 element is missing required props', () => {
    setupProps();
    props.set('oauth.callback.url', null);
    try {
      provisioner.create('myoauth1element');
    } catch (e) {
      return true;
    }
    throw Error('Should not have gotten here!');
  });

  it('should allow creating an oauth2 element instance', () => {
    setupProps();
    return provisioner.create('myoauth2element')
      .then(r => {
        expect(r).not.to.be.null;
        expect(r.body).not.to.be.null;
        expect(r.body.id).to.equal(123);
        expect(r.body.providerData).not.to.be.null;
        expect(r.body.providerData.code).to.equal('speakercity');
      })
      .then(r => mockery.disable());
  });

  it('should allow deleting an element instance', () => {
    setupProps();
    return provisioner.delete(123);
  });
});
