'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const chocolate = require('core/chocolate');
const props = require('core/props');
const urlParser = require('url');

var exports = module.exports = {};

const genConfig = (props, args) => {
  const config = props;
  if (args) Object.keys(args).forEach(k => config[k] = args[k]);
  return config;
};

const parseOAuthProps = (element) => {
  return new Promise((res, rej) => {
    res({
      qs: {
        apiKey: props.getForKey(element, 'oauth.api.key'),
        apiSecret: props.getForKey(element, 'oauth.api.secret'),
        callbackUrl: props.getForKey(element, 'oauth.callback.url')
      }
    });
  })
};

const createInstance = (element, config, providerData) => {
  const instance = {
    name: 'churros-instance',
    element: {
      key: element
    },
    configuration: config
  };

  if (providerData) instance.providerData = providerData;

  return chakram.post('/instances', instance)
    .then(r => {
      expect(r).to.have.statusCode(200);
      console.log('Created %s element instance with ID: %s', element, r.body.id);
      chocolate.authReset(r.body.token);
      return r;
    })
    .catch(r => chocolate.logAndThrow('Failed to create an instance of %s', r, element));
};

const oauth = (element, options) => {
  const url = util.format('/elements/%s/oauth/url', element);
  console.log(url);
  console.log(options);
  return chakram.get(url, options)
    .then(r => {
      require('core/oauth')(element)(r, config.username, config.password);

      const query = urlParser.parse(r, true).query;
      const providerData = {
        oauth_token: query.oauth_token,
        oauth_verifier: query.oauth_verifier,
        secret: oauthSecret
      };
    });
};

const oauth1 = (element, options) => {
  const oauthTokenUrl = util.format('/elements/%s/oauth/token', element);
  return chakram.get(oauthTokenUrl, options)
    .then(r => {
      expect(r).to.have.status(200);
      options.qs.requestToken = r.body.token;
      options.secret = r.body.secret;
      return options;
    });
};

exports.create = (element, args) => {
  console.log('Attempting to provision %s', element);

  const type = props.getOptionalForKey(element, 'provisioning');
  const config = genConfig(props.all(element), args);

  switch (type) {
  case 'oauth1':
    return parseOAuthProps(element)
      .then(r => oauth1(element, r))
      .then(r => oauth(element, r))
      .then(r => createInstance(element, r));
  case 'oauth2':
    return parseOAuthProps(element)
      .then(r => oauth2(element, r))
      .then(r => oauth(element, r))
      .then(r => createInstance(element, r));
  default:
    return createInstance(element, config);
  }
};

exports.delete = (id) => {
  return chakram.delete('/instances/' + id)
    .then(r => {
      expect(r).to.have.statusCode(200);
      console.log('Deleted element instance with ID: ' + id);
      chocolate.authReset();
      return r.body;
    })
    .catch(r => console.log('Failed to delete element instance: %s', r));
};
