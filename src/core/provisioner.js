/** @module core/provisioner */
'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const tools = require('core/tools');
const props = require('core/props');
const urlParser = require('url');
const logger = require('winston');
const o = require('core/oauth');
const r = require('request');
const defaults = require('core/defaults');
const cloud = require('core/cloud');
const argv = require('optimist').argv;

var exports = module.exports = {};

const genInstance = (config) =>
  ({
    name: config.name,
    element: { key: config.element },
    configuration: config.ec
  });

const genConfig = (props, args) => {
  const config = Object.assign({}, props, args);

  const name = (args && args.name) ? args.name : 'churros-instance';
  const tags = (args && args.tags) ? args.tags : undefined;
  delete config.name;

  return {
    ec: config,
    name: name,
    tags: tags
  };
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
        siteAddress: props.getOptionalForKey(element, 'site.address'),
        subdomain: props.getOptionalForKey(element, 'subdomain')
      }
    }
  };
  return new Promise((res, rej) => res(args));
};

const addParams = (instance) => {
  let instanceCopy = JSON.parse(JSON.stringify(instance));
  if (argv.params) instanceCopy.configuration = Object.assign({}, instanceCopy.configuration, JSON.parse(argv.params));
  return instanceCopy;
};

const addParamsToOptions = (argOptions) => {
  let optionsCopy = JSON.parse(JSON.stringify(argOptions));
  if (argv.params) optionsCopy.qs = Object.assign({}, optionsCopy.qs, JSON.parse(argv.params));
  return optionsCopy;
};

const createInstance = (element, config, providerData, baseApi) => {
  config.element = tools.getBaseElement(element);
  const instance = genInstance(config);

  baseApi = (baseApi) ? baseApi : '/instances';

  if (providerData) instance.providerData = providerData;

  return cloud.post(baseApi, addParams(instance))
    .then(r => {
      expect(r).to.have.statusCode(200);
      logger.debug('Created %s element instance with ID: %s', element, r.body.id);
      defaults.token(r.body.token);
      return r;
    })
    .catch(r => tools.logAndThrow('Failed to create an instance of %s', r, element));
};

const createExternalInstance = (element, config, providerData) => {
  const tokenUrl = config.tokenUrl;
  const apiKey = config['oauth.api.key'];
  const apiSecret = config['oauth.api.secret'];
  const callbackUrl = props.get('oauth.callback.url');
  const code = providerData.code;
  let instanceBody;

  if (!tokenUrl) {
    throw Error("Token URL must be present in the element props as 'tokenUrl'");
  }
  let instanceElement = tools.getBaseElement(element);

  return new Promise((res, rej) => {
    r.post({
      url: tokenUrl,
      form: {
        client_id: apiKey,
        client_secret: apiSecret,
        grant_type: 'authorization_code',
        redirect_uri: callbackUrl,
        code: code
      }
    }, (e, r, b) => {
      let body = JSON.parse(b);
      let refreshToken = body.refresh_token;
      instanceBody = {
        "element": {
          "key": instanceElement
        },
        "configuration": {
          "oauth.user.refresh_token": refreshToken,
          "oauth.api.key": apiKey,
          "oauth.api.secret": apiSecret,
          "oauth.resource.url": props.getOptionalForKey(element, 'site.address'),
          "site.url": props.getOptionalForKey(element, 'site.address'),
          "site.address": props.getOptionalForKey(element, 'site.address')
        },
        "name": `${element} external auth churros`,
        "externalAuthentication": "initial"
      };
      res(cloud.post('/instances', instanceBody));
    });
  });
};

const oauth = (element, args, config) => {
  let urlElement = tools.getBaseElement(element);
  const url = `/elements/${urlElement}/oauth/url`;
  logger.debug('GET %s with options %s', url, JSON.stringify(addParamsToOptions(args.options)));
  return cloud.withOptions(addParamsToOptions(args.options)).get(url)
    .then(r => {
      expect(r).to.have.statusCode(200);
      return o(element, r, args.username, args.password, config);
    })
    .catch(err => {
      logger.error("OAuth exchange failed: %s", err);
      throw err;
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
  return cloud.withOptions(args.options).get(oauthTokenUrl)
    .then(r => {
      expect(r).to.have.statusCode(200);
      args.options.qs.requestToken = r.body.token;
      args.secret = r.body.secret;
      return args;
    });
};

/**
 * Handles orchestrating this create, which can flow different ways depending on what type of
 * provisioning this element support
 * @param  {string} element  The element key
 * @param  {object} args     The args to pass on the create instance call
 * @param  {string} baseApi  The base API
 * @return {Promise}         JS promise that resolves to the instance created
 */
const orchestrateCreate = (element, args, baseApi, cb) => {
  const type = props.getOptionalForKey(element, 'provisioning');
  const config = genConfig(props.all(element), args);
  config.element = element;

  logger.debug('Attempting to provision %s using the %s provisioning flow', element, type ? type : 'standard');

  switch (type) {
    case 'oauth1':
    case 'oauth2':
      config.ec['oauth.callback.url'] = props.getOptionalForKey(element, 'oauth.callback.url') === null ?
        props.get('oauth.callback.url') :
        props.getForKey(element, 'oauth.callback.url');
      logger.debug('Using callback URL: ' + config.ec['oauth.callback.url']);
      return parseProps(element)
        .then(r => (type === 'oauth1') ? oauth1(element, r) : r)
        .then(r => oauth(element, r, config.ec))
        .then(r => cb(type, config, r));
    case 'custom':
      const cp = `${__dirname}/../test/elements/${element}/provisioner`;
      return require(cp).create(config);
    default:
      return createInstance(element, config, undefined, baseApi);
  }
};

/**
 * Provision an element using just the partial OAuth flow.
 * @param {string} element The element key
 * @param {Object} args Any other args to pass when provisioning the element
 * @param {string} baseApi The base API
 * @return {Promise}  A promise that will resolve to the response after the partial OAuth flow is complete
 */
exports.partialOauth = (element, args, baseApi) => orchestrateCreate(element, args, baseApi, (type, config, r) => r.code);

/**
 * Provision an element instance
 * @param {string} element The element key
 * @param {Object} args All properties that are available in churros props for this element
 * @param {string} baseApi The base API
 * @return {Promise}  A promise that resolves to the HTTP response after attempting to create the element instance
 */
exports.create = (element, args, baseApi) => {
  const cb = (type, config, r) => {
    const external = props.getOptionalForKey(element, 'external');

    if (external && type === 'oauth2') return createExternalInstance(element, config.ec, r);
    if (external && type === 'oauth1') throw Error('External Authentication via churros is not yet implemented for OAuth1');

    return createInstance(element, config, r, baseApi);
  };

  return orchestrateCreate(element, args, baseApi, cb);
};

/**
 * Delete an element instance
 * @param {number} id The element instance ID
 * @param {string} baseApi The base API
 * @return {Promise}  A promise that resolves to the HTTP response after attempting to delete this element instance
 */
exports.delete = (id, baseApi) => {
  if (!id) return;

  baseApi = (baseApi) ? baseApi : '/instances';
  // when running the delete API, don't include the element token in the auth header
  const { userSecret, orgSecret } = defaults.secrets();
  const headers = { Authorization: `User ${userSecret}, Organization ${orgSecret}` };
  return cloud.withOptions({ headers }).delete(`${baseApi}/${id}`)
    .then(r => {
      logger.debug(`Deleted element instance with ID: ${id}`);
      defaults.reset();
      return r.body;
    })
    .catch(r => tools.logAndThrow('Failed to delete element instance with ID: %s', r, id));
};