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

const setupProps = () => {
  props({
    'user': 'franky',
    'oauth.callback.url': 'http://myfakecallbackurl',
    'myelement': {
      'username': 'frank',
      'password': 'ricard'
    },
    'badelement': {
      'username': 'frank',
      'password': 'ricard'
    },
    'myoauth1element': {
      'provisioning': 'oauth1',
      'username': 'frank',
      'password': 'ricard',
      'oauth.api.key': 'he gon do one',
      'oauth.api.secret': 'fill it up again'
    },
    'myoauth2element': {
      'provisioning': 'oauth2',
      'username': 'frank',
      'password': 'ricard',
      'oauth.api.key': 'he gon do one',
      'oauth.api.secret': 'fill it up again'
    },
    'myoauth2external': {
      'provisioning': 'oauth2',
      'external': true,
      'username': 'frank',
      'password': 'ricard',
      'oauth.api.key': 'he gon do one',
      'oauth.api.secret': 'fill it up again',
      'tokenUrl': 'http://pvenkman.ghostbuster.com/token'
    },
    'myoauth1external': {
      'provisioning': 'oauth1',
      'external': true,
      'username': 'frank',
      'password': 'ricard',
      'oauth.api.key': 'he gon do one',
      'oauth.api.secret': 'fill it up again',
      'tokenUrl': 'http://pvenkman.ghostbuster.com/token'
    },
    'noTokenUrl': {
      'provisioning': 'oauth2',
      'external': true,
      'username': 'frank',
      'password': 'ricard',
      'oauth.api.key': 'he gon do one',
      'oauth.api.secret': 'fill it up again'
    },
    'customProvisioning': {
      'provisioning': 'custom',
      'username': 'frank'
    }
  });
};

describe('provisioner', () => {
  /** Before each because we run all of the unit tests at once and initializing some of these things
  in multiple before blocks breaks things. I prefer them to be self-contained as opposed to a global
  before or something like that ... */
  beforeEach(() => {
    defaults(baseUrl, 'fake', 'fake', 'churrosUnitTester');

    /** Has to be in before each with current approach: https://github.com/pgte/nock#specifying-hostname **/
    nock(baseUrl, headers())
      .post('/instances')
      .reply(200, (uri, requestBody) => {
        requestBody.id = 123;
        return requestBody;
      })
      .post('/instances', {
        name: 'churros-instance',
        element: { key: 'badelement' }
      })
      .reply(404, (uri, requestBody) => {
        return { message: 'No element found with key badelement' };
      })
      .delete('/instances/123')
      .reply(200)
      .delete('/instances/456')
      .reply(404);

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

    nock(baseUrl, headers())
      .get('/elements/myoauth2external/oauth/url')
      .query(true)
      .reply(200, () => new Object({
        oauthUrl: 'http://frankthetanksoauthurl.com'
      }));

    nock(baseUrl, headers())
      .get('/elements/myoauth1external/oauth/token')
      .query(true)
      .reply(200, () => new Object({
        oauthUrl: 'http://frankthetanksoauthurl.com'
      }));

    nock(baseUrl, headers())
      .get('/elements/myoauth1external/oauth/url')
      .query(true)
      .reply(200, () => new Object({
        oauthUrl: 'http://frankthetanksoauthurl.com'
      }));

    nock(baseUrl, headers())
      .get('/elements/noTokenUrl/oauth/url')
      .query(true)
      .reply(200, () => new Object({
        oauthUrl: 'http://frankthetanksoauthurl.com'
      }));

    nock('http://pvenkman.ghostbuster.com')
      .post('/token')
      .reply(200, () => new Object({
        refresh_token: 'peters refresh token'
      }));

  });

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

  it('should allow creating an oauth2 external instance', () => {
    setupProps();
    return provisioner.create('myoauth2external')
      .then(r => {
        expect(r).not.to.be.null;
        expect(r.body).not.to.be.null;
        expect(r.body.id).to.equal(123);
        expect(r.body.configuration).to.not.be.null;
        expect(r.body.configuration['oauth.api.key']).to.equal('he gon do one');
        expect(r.body.configuration['oauth.api.secret']).to.equal('fill it up again');
        expect(r.body.configuration['oauth.user.refresh_token']).to.equal('peters refresh token');
      })
      .then(r => mockery.disable());
  });

  it('should allow partially provisioning an oauth2 element instance', () => {
    setupProps();
    return provisioner.partialOauth('myoauth2element')
      .then(r => {
        expect(r).to.exist;
        expect(r).to.equal('speakercity');
      })
      .then(r => mockery.disable());
  });

  it('should throw an error for provisioning an oauth1 element with external', () => {
    setupProps();
    return provisioner.create('myoauth1external')
      .catch(e => {
        expect(e).to.not.be.null;
        expect(e.message).to.equal('External Authentication via churros is not yet implemented for OAuth1');
      });
  });

  it('should throw an error for provisioning an oauth2 element with no token url', () => {
    setupProps();
    return provisioner.create('noTokenUrl')
      .catch(e => {
        expect(e).to.not.be.null;
        expect(e.message).to.equal(`Token URL must be present in the element props as 'tokenUrl'`);
      });
  });

  it('should throw an error if creating an element instance does not return a 200', () => {
    setupProps();
    return provisioner.create('badelement')
      .then(r => {
        throw Error('Where my error at?');
      })
      .catch(r => true);
  });

  it('should allow deleting an element instance', () => {
    setupProps();
    return provisioner.delete(123);
  });

  it('should throw an error if deleting an element instance does not return a 200', () => {
    setupProps();
    return provisioner.delete(456)
      .then(r => {
        throw Error('Where my error at?');
      })
      .catch(r => true);
  });

  it('should allow creating an element instance with custom provisioning', () => {
    setupProps();
    const mockProvisioner = {
      create: (config) => new Promise((res, rej) => res({ body: { token: 123 } }))
    };
    const s = `${__dirname}`.split('/');
    const root = s.filter((i) => i !== 'test' && i !== 'core').reduce((fullPath, item) => fullPath + '/' + item);
    const reqPath = `${root}/src/core/../test/elements/customProvisioning/provisioner`;
    mockery.registerMock(reqPath, mockProvisioner);
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });
    return provisioner.create('customProvisioning')
      .then(r => {
        mockery.disable();
      });
  });
});
