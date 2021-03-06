'use strict';

const tools = require('core/tools');
const fs = require('fs');
const chakram = require('chakram');
const expect = chakram.expect;
const logger = require('winston');
const argv = require('optimist').argv;
const props = require('core/props');
const _ = require('lodash');

var exports = module.exports = {};

const validator = (validationCb, api) => {
  let tranformedObjs = props.getOptionalForKey(props.getOptional('element'), 'transformed') || [];
  //Only use the transformation if it is the endpoint that has been transformed
  let transform = tranformedObjs.reduce((acc, cur) => acc = acc ? acc : api.split('/').slice(-2).filter(str => str === cur).length > 0 && !api.includes('bulk') ? true : false, false);
  let transformRes = r => {
    if (transform && argv.transform && _.isArray(r.body)) r.body.forEach(obj => _.isPlainObject(obj) ? obj.id = obj.idTransformed : null);
    if (transform && argv.transform && _.isPlainObject(r.body)) r.body.id = r.body.idTransformed;
  };
  if (typeof validationCb === 'function') {
    return (r) => {
      logger.debug(`Validating response against validation callback.  Response body: ${tools.stringify(r.body)}`);
      validationCb(r);
      transformRes(r);

      return r;
    };
  } else if (typeof validationCb === 'undefined' || (typeof validationCb === 'object' && validationCb === null)) {
    return (r) => {
      if (typeof r.body === 'object') logger.debug(`Validating that response is 200.  Response body: ${tools.stringify(r.body)}`);
      expect(r).to.have.statusCode(200);
      transformRes(r);

      return r;
    };
  } else {
    // assuming this is an actual schema at this point...if it's not, this will fail miserably
    return (r) => {
      logger.debug(`Validating response against JSON schema. Response body: ${tools.stringify(r.body)}`);
      expect(r).to.have.schemaAnd200(validationCb);
      transformRes(r);

      return r;
    };
  }
};

const post = (api, payload, validationCb, options) => {
  logger.debug('POST %s with options %s and body %s', api, options, JSON.stringify(payload));
  return chakram.post(api, payload, options)
    .then(r => validator(validationCb, api)(r))
    .catch(r => tools.logAndThrow('Failed to create or validate: %s', r, api));
};
/**
 * HTTP POST
 * @param  {apiString} api          The API to call
 * @param  {Object} payload      The optional JSON payload to send on this API call
 * @param  {Function} validationCb The optional validation callback function to use to validate the HTTP response
 * @param  {Object} options       The optional request options to use on this HTTP request
 * @return {Promise}  A Promise that resolves to the HTTP response
 */
exports.post = (api, payload, validationCb) => post(api, payload, validationCb, null);

const get = (api, validationCb, options) => {
  logger.debug('GET %s with options %s', api, JSON.stringify(options));
  return chakram.get(api, options)
    .then(r => validator(validationCb, api)(r))
    .catch(r => tools.logAndThrow('Failed to retrieve or validate: %s', r, api));
};

/**
 * HTTP GET
 * @param  {string} api          The API to call
 * @param  {Function} validationCb The optional validation callback function to use to validate the HTTP response
 * @return {Promise}  A Promise that resolves to the HTTP response
 */
exports.get = (api, validationCb) => get(api, validationCb, null);

const modifyPayload = (payload, options) => {
  if (!options || !options.churros) return payload;
  let updatePayload = options.churros.updatePayload;
  return updatePayload ? updatePayload : payload;
};

const update = (api, payload, validationCb, chakramCb, options) => {
  payload = modifyPayload(payload, options);
  chakramCb = (chakramCb || chakram.patch);
  logger.debug('%s %s with options %s', chakramCb === chakram.patch ? 'PATCH' : 'PUT', api, options);

  return chakramCb(api, payload, options)
    .then(r => validator(validationCb, api)(r))
    .catch(r => tools.logAndThrow('Failed to update %s', r, api));
};
exports.update = (api, payload, validationCb, chakramCb) => update(api, payload, validationCb, chakramCb, null);

const patch = (api, payload, validationCb, options) => update(api, payload, validationCb, chakram.patch, options);
/**
 * HTTP PATCH
 * @param  {string} api          The API to call
 * @param  {Object} payload      The optional JSON payload
 * @param  {Function} validationCb The optional validation callback function used to validate the HTTP response
 * @return {Promise}              A Promise that resolves to the HTTP response
 */
exports.patch = (api, payload, validationCb) => patch(api, payload, validationCb, null);

const put = (api, payload, validationCb, options) => update(api, payload, validationCb, chakram.put, options);
/**
 * HTTP PUT
 * @param  {string} api          The API to call
 * @param  {Object} payload      The optional JSON payload
 * @param  {Function} validationCb The optional validation callback function used to validate the HTTP response
 * @return {Promise}              A Promise that resolves to the HTTP response
 */
exports.put = (api, payload, validationCb) => put(api, payload, validationCb, null);

const remove = (api, validationCb, options) => {
  logger.debug('DELETE %s with options %s', api, options);
  return chakram.delete(api, null, options)
    .then(r => validator(validationCb, api)(r))
    .catch(r => tools.logAndThrow('Failed to delete %s', r, api));
};

/**
 * HTTP DELETE
 * @param  {string} api          The API to call
 * @param  {Function} validationCb The optional validation callback function used to validate the HTTP response
 * @return {Promise}              A Promise that resolves to the HTTP response
 */
exports.delete = (api, validationCb) => remove(api, validationCb, null);

/**
 * HTTP POST a file
 * @param  {string} api        The API to call
 * @param  {string} filePath   The local file system path to the file to upload
 * @param  {Object} options    The HTTP request options
 * @return {Promise}           A Promise that resolves to the HTTP response
 */
const postFile = (api, filePath, validationCb, options) => {
  options = (options || {});
  options.formData = (options.formData || {});
  options.formData.file = fs.createReadStream(filePath);

  logger.debug('POST %s with multipart/form-data file', api);
  return chakram.post(api, validationCb, options)
    .then(r => validator(validationCb, api)(r))
    .catch(r => tools.logAndThrow('Failed to upload file to %s', r, api));
};
exports.postFile = postFile;

/**
 * HTTP PATCH a file
 * @param  {string} api        The API to call
 * @param  {string} filePath   The local file system path to the file to upload
 * @return {Promise}           A Promise that resolves to the HTTP response
 */
const patchFile = (api, filePath, options) => {
  options = (options || {});
  options.formData = { file: fs.createReadStream(filePath) };

  logger.debug('PATCH %s with multipart/form-data file');
  return chakram.patch(api, undefined, options)
    .then(r => validator(undefined)(r))
    .catch(r => tools.logAndThrow('Failed to upload file to %s', r, api));
};
exports.patchFile = patchFile;

/**
 * HTTP PUT a file
 * @param  {string} api        The API to call
 * @param  {string} filePath   The local file system path to the file to upload
 * @return {Promise}           A Promise that resolves to the HTTP response
 */
const putFile = (api, filePath, options) => {
  options = (options || {});
  options.formData = { file: fs.createReadStream(filePath) };

  logger.debug('PUT %s with multipart/form-data file');
  return chakram.put(api, undefined, options)
    .then(r => validator(undefined)(r))
    .catch(r => tools.logAndThrow('Failed to upload file to %s', r, api));
};
exports.putFile = putFile;

/**
 * Create, retrieve and delete a resource by its `id` field
 * @param {string} api The API to Create
 * @param {Object} payload The JSON payload used to Create
 * @param {Function} validationCb The validation callback to validate responses
 * @param {Object} options The optional request options
 * @return {Promise}  The Promise that resolves to the last HTTP response
 */

const crd = (api, payload, validationCb, options) => {
  return post(api, payload, validationCb, options)
    .then(r => get(api + '/' + r.body.id, validationCb, options))
    .then(r => remove(api + '/' + r.body.id, null, options));
};
exports.crd = crd;

/**
 * Create and delete a resource by its `id` field
 * @param {string} api The API to Create
 * @param {Object} payload The JSON payload used to Create
 * @param {Function} validationCb The validation callback to validate responses
 * @param {Object} options The optional request options
 * @return {Promise}  The Promise that resolves to the last HTTP response
 */
const cd = (api, payload, validationCb, options) => {
  return post(api, payload, validationCb, options)
    .then(r => remove(api + '/' + r.body.id, null, options));
};
exports.cd = cd;

const crds = (api, payload, validationCb, options) => {
  let createdId = -1;
  return post(api, payload, validationCb, options)
    .then(r => createdId = r.body.id)
    .then(r => get(api + '/' + createdId, validationCb, options))
    .then(r => get(api, validationCb, options))
    .then(r => remove(api + '/' + createdId, null, options));
};
exports.crds = crds;

const crud = (api, payload, validationCb, updateCb, options) => {
  return post(api, payload, validationCb, options)
    .then(r => get(api + '/' + r.body.id, validationCb, options))
    .then(r => update(api + '/' + r.body.id, payload, validationCb, updateCb, options))
    .then(r => remove(api + '/' + r.body.id, null, options));
};
exports.crud = crud;

const cruds = (api, payload, validationCb, updateCb, options) => {
  let createdId = -1;
  return post(api, payload, validationCb, options)
    .then(r => createdId = r.body.id)
    .then(r => get(`${api}/${createdId}`, validationCb, options))
    .then(r => update(`${api}/${createdId}`, payload, validationCb, updateCb, options))
    .then(r => get(api, validationCb, options))
    .then(r => remove(`${api}/${createdId}`, null, options));
};
exports.cruds = cruds;

const crus = (api, payload, validationCb, updateCb, options) => {
  let createdId = -1;
  return post(api, payload, validationCb, options)
    .then(r => createdId = r.body.id)
    .then(r => get(api + '/' + createdId, validationCb, options))
    .then(r => update(api + '/' + createdId, payload, validationCb, updateCb, options))
    .then(r => get(api, validationCb, options));
};
exports.crus = crus;

const sr = (api, validationCb, options) => {
  return get(api, validationCb, options)
    .then(r => get(api + '/' + r.body[0].id, validationCb, options));
};
exports.sr = sr;
const crs = (api, payload, validationCb, options) => {
  return post(api, payload, validationCb, options)
    .then(r => get(api + '/' + r.body.id, validationCb, options))
    .then(r => get(api, validationCb, options));
};
exports.crs = crs;

const cr = (api, payload, validationCb, options) => {
  return post(api, payload, validationCb, options)
    .then(r => get(api + '/' + r.body.id, validationCb, options));
};
exports.cr = cr;

const cs = (api, payload, validationCb, options) => {
  return post(api, payload, validationCb, options)
    .then(r => get(api, validationCb, options));
};
exports.cs = cs;

/*
 * Gives you access to adding HTTP request options to any of the HTTP-related APIs
 */
const withOptions = (options) => {
  return {
    post: (api, payload, validationCb) => post(api, payload, validationCb, options),
    postFile: (api, filePath, validationCb) => postFile(api, filePath, validationCb, options),
    patchFile: (api, filePath) => patchFile(api, filePath, options),
    putFile: (api, filePath) => putFile(api, filePath, options),
    put: (api, payload, validationCb) => put(api, payload, validationCb, options),
    patch: (api, payload, validationCb) => patch(api, payload, validationCb, options),
    update: (api, payload, validationCb, chakramCb) => update(api, payload, validationCb, chakramCb, options),
    get: (api, validationCb) => get(api, validationCb, options),
    delete: (api, validationCb) => remove(api, validationCb, options),
    cruds: (api, payload, validationCb, updateCb) => cruds(api, payload, validationCb, updateCb, options),
    crd: (api, payload, validationCb, updateCb) => crd(api, payload, validationCb, updateCb, options),
    cd: (api, payload, validationCb) => cd(api, payload, validationCb, options),
    crds: (api, payload, validationCb) => crds(api, payload, validationCb, options),
    crud: (api, payload, validationCb, updateCb) => crud(api, payload, validationCb, updateCb, options),
    crus: (api, payload, validationCb, updateCb) => crus(api, payload, validationCb, updateCb, options),
    sr: (api, validationCb) => sr(api, validationCb, options),
    crs: (api, payload, validationCb) => crs(api, payload, validationCb, options),
    cr: (api, payload, validationCb) => cr(api, payload, validationCb, options),
    cs: (api, payload, validationCb) => cs(api, payload, validationCb, options),
    withOptions: (moreOptions) => withOptions(Object.assign(options, moreOptions))
  };
};
exports.withOptions = withOptions;

exports.createEvents = (element, replacements, eventRequest, numEvents) => {
  numEvents = (numEvents || 1);

  const api = eventRequest.api;
  let headers = eventRequest.headers;
  let query = eventRequest.query;
  let payload = eventRequest.body;
  for (var replaceKey in replacements) {
    if (headers) {
      for (var hkey in headers) {
        headers[hkey] = headers[hkey].replace(replaceKey, replacements[replaceKey]);
      }
    }
    if (query) {
      for (var qkey in query) {
        query[qkey] = query[qkey].replace(replaceKey, replacements[replaceKey]);
      }
    }
    if (payload) {
      if (typeof payload === 'string') {
        payload = payload.replace(replaceKey, replacements[replaceKey]);
      }
    }
  }
  const options = { headers: headers, qs: eventRequest.query };

  logger.debug('Attempting to send %s events to %s', numEvents, api);
  let promises = [];
  for (let i = 0; i < numEvents; i++) {
    let response;
    if (eventRequest.method === 'GET') {
      response = chakram.get(api, options);
    } else {
      response = chakram.post(api, payload, options);
    }
    promises.push(response);
  }
  return chakram.all(promises);

};
