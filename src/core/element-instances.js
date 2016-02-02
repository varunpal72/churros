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

const parseProps = (element) => {
  const args = {
    username: props.getForKey(element, 'username'),
    password: props.getForKey(element, 'password'),
    options: {
      qs: {
        apiKey: props.getForKey(element, 'oauth.api.key'),
        apiSecret: props.getForKey(element, 'oauth.api.secret'),
        callbackUrl: props.get('oauth.callback.url')
      }
    }
  };
  return new Promise((res, rej) => res(args));
};

const createInstance = (element, config, providerData) => {
  const instance = {
    name: 'churros-instance',
    element: { key: element },
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

const oauth = (element, args, config) => {
  const url = util.format('/elements/%s/oauth/url', element);
  return chakram.get(url, args.options)
    .then(r => require('core/oauth')(element, r, args.username, args.password, config))
    .then(r => {
      const query = urlParser.parse(r, true).query;
      const providerData = {
        code: query.code,
        oauth_token: query.oauth_token,
        oauth_verifier: query.oauth_verifier,
        secret: args.secret
      };
      return providerData;
    });
};

const oauth1 = (element, args) => {
  const oauthTokenUrl = util.format('/elements/%s/oauth/token', element);
  return chakram.get(oauthTokenUrl, args.options)
    .then(r => {
      expect(r).to.have.status(200);
      args.options.qs.requestToken = r.body.token;
      args.secret = r.body.secret;
      return args;
    });
};

exports.create = (element, args) => {
  const type = props.getOptionalForKey(element, 'provisioning');
  const config = genConfig(props.all(element), args);

  console.log('Attempting to provision %s using the %s provisioning flow', element, type ? type : 'standard');

  switch (type) {
  case 'oauth1':
  case 'oauth2':
    config['oauth.callback.url'] = props.get('oauth.callback.url');
    return parseProps(element)
      .then(r => (type === 'oauth1') ? oauth1(element, r) : r)
      .then(r => oauth(element, r, config))
      .then(r => createInstance(element, config, r));
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
