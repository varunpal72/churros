'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const tools = require('core/tools');
const props = require('core/props');
const urlParser = require('url');
const logger = require('winston');
const o = require('core/oauth');
const defaults = require('core/defaults');

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
        callbackUrl: (props.getOptionalForKey(element, 'oauth.callback.url') || props.get('oauth.callback.url')),
        scope: props.getOptionalForKey(element, 'oauth.scope'),
        siteAddress: props.getOptionalForKey(element, 'site.address')
      }
    }
  };
  return new Promise((res, rej) => res(args));
};

const createInstance = (element, config, providerData, baseApi) => {
  const instance = {
    name: 'churros-instance',
    element: { key: element },
    configuration: config
  };
  baseApi = (baseApi) ? baseApi : '/instances';

  if (providerData) instance.providerData = providerData;

  return chakram.post(baseApi, instance)
    .then(r => {
      expect(r).to.have.statusCode(200);
      logger.debug('Created %s element instance with ID: %s', element, r.body.id);
      defaults.token(r.body.token);
      return r;
    })
    .catch(r => tools.logAndThrow('Failed to create an instance of %s', r, element));
};

const oauth = (element, args, config) => {
  const url = `/elements/${element}/oauth/url`;
  logger.debug('GET %s with options %s', url, args.options);
  return chakram.get(url, args.options)
    .then(r => {
      expect(r).to.have.statusCode(200);
      return o(element, r, args.username, args.password, config);
    })
    .then(r => {
      const query = urlParser.parse(r, true).query;
      expect(query).to.not.be.null;
      const providerData = {
        code: query.code,
        apikey: query.apikey,
        access_token: query.access_token,
        refresh_token: query.refresh_token,
        expires_in: query.expires_in,
        state: query.state,
        oauth_token: query.oauth_token,
        oauth_verifier: query.oauth_verifier,
        secret: args.secret,
        realmId: query.realmId,
        dataSource: query.dataSource
      };
      return providerData;
    });
};

const oauth1 = (element, args) => {
  const oauthTokenUrl = `/elements/${element}/oauth/token`;
  return chakram.get(oauthTokenUrl, args.options)
    .then(r => {
      expect(r).to.have.statusCode(200);
      args.options.qs.requestToken = r.body.token;
      args.secret = r.body.secret;
      return args;
    });
};

exports.create = (element, args, baseApi) => {
  const type = props.getOptionalForKey(element, 'provisioning');
  const config = genConfig(props.all(element), args);

  logger.debug('Attempting to provision %s using the %s provisioning flow', element, type ? type : 'standard');

  switch (type) {
    case 'oauth1':
    case 'oauth2':
      config['oauth.callback.url'] = props.getOptionalForKey(element, 'oauth.callback.url') === null ?
        props.get('oauth.callback.url') :
        props.getForKey(element, 'oauth.callback.url');
      logger.debug('Using callback URL: ' + config['oauth.callback.url']);
      return parseProps(element)
        .then(r => (type === 'oauth1') ? oauth1(element, r) : r)
        .then(r => oauth(element, r, config))
        .then(r => createInstance(element, config, r, baseApi));
    default:
      return createInstance(element, config, undefined, baseApi);
  }
};

exports.delete = (id, baseApi) => {
  baseApi = (baseApi) ? baseApi : '/instances';
  return chakram.delete(baseApi + '/' + id)
    .then(r => {
      expect(r).to.have.statusCode(200);
      logger.debug('Deleted element instance with ID: ' + id);
      defaults.reset();
      return r.body;
    })
    .catch(r => tools.logAndThrow('Failed to delete element instance with ID: %s', r, id));
};
