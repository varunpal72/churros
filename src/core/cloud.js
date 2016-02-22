'use strict';

const tools = require('core/tools');
const http = require('http');
const fs = require('fs');
const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const logger = require('winston');

var exports = module.exports = {};

const validator = (schemaOrValidationCb) => {
  if (typeof schemaOrValidationCb === 'function') {
    return (r) => {
      schemaOrValidationCb(r);
      return r;
    };
  } else if (typeof schemaOrValidationCb === 'undefined' || (typeof schemaOrValidationCb === 'object' && schemaOrValidationCb === null)) {
    return (r) => {
      expect(r).to.have.statusCode(200);
      return r;
    };
  } else {
    return (r) => {
      expect(r).to.have.schemaAnd200(schemaOrValidationCb);
      return r;
    };
  }
};

const post = (api, payload, schema, options) => {
  logger.debug('POST %s with options %s', api, options);
  return chakram.post(api, payload, options)
    .then(r => validator(schema)(r))
    .catch(r => tools.logAndThrow('Failed to create %s', r, api));
};
exports.post = post;

const get = (api, schema, options) => {
  logger.debug('GET %s with options %s', api, options);
  return chakram.get(api, options)
    .then(r => validator(schema)(r))
    .catch(r => tools.logAndThrow('Failed to retrieve %s', r, api));
};
exports.get = get;

const update = (api, payload, schema, cb, options) => {
  cb = (cb || chakram.patch);
  logger.debug('%s %s with options %s', cb === chakram.patch ? 'PATCH' : 'PUT', api, options);

  return cb(api, payload, options)
    .then(r => validator(schema)(r))
    .catch(r => tools.logAndThrow('Failed to update %s', r, api));
};
exports.update = update;
exports.patch = (api, payload, schema, options) => update(api, payload, schema, chakram.patch, options);
exports.put = (api, payload, schema, options) => update(api, payload, schema, chakram.put, options);

const remove = (api, options) => {
  logger.debug('DELETE %s with options %s', api, options);
  return chakram.delete(api, options)
    .then(r => {
      expect(r).to.have.statusCode(200);
      return r;
    })
    .catch(r => tools.logAndThrow('Failed to delete %s', r, api));
};
exports.delete = remove;

const find = (api, schema, options) => {
  logger.debug('GET %s with options %s', api, options);
  return chakram.get(api, options)
    .then(r => validator(schema)(r))
    .catch(r => tools.logAndThrow('Failed to find %s', r, api));
};
exports.find = find;

const postFile = (api, filePath, options) => {
  options = (options || {});
  options.formData = { file: fs.createReadStream(filePath) };

  return chakram.post(api, undefined, options)
    .then(r => validator(undefined)(r))
    .catch(r => tools.logAndThrow('Failed to upload file to %s', r, api));
};
exports.postFile = postFile;

const crd = (api, payload, schema) => {
  return post(api, payload, schema)
    .then(r => get(api + '/' + r.body.id, schema))
    .then(r => remove(api + '/' + r.body.id));
};
exports.crd = crd;

const crds = (api, payload, schema) => {
  let createdId = -1;
  return post(api, payload, schema)
    .then(r => createdId = r.body.id)
    .then(r => get(api + '/' + createdId, schema))
    .then(r => find(api, schema))
    .then(r => remove(api + '/' + createdId));
};
exports.crds = crds;

const crud = (api, payload, schema, updateCb) => {
  return post(api, payload, schema)
    .then(r => get(api + '/' + r.body.id, schema))
    .then(r => update(api + '/' + r.body.id, payload, schema, updateCb))
    .then(r => remove(api + '/' + r.body.id));
};
exports.crud = crud;

const cruds = (api, payload, schema, updateCb) => {
  let createdId = -1;
  return post(api, payload, schema)
    .then(r => createdId = r.body.id)
    .then(r => get(api + '/' + createdId, schema))
    .then(r => update(api + '/' + createdId, payload, schema, updateCb))
    .then(r => find(api, schema))
    .then(r => remove(api + '/' + createdId));
};
exports.cruds = cruds;

const createEvents = (element, eiId, payload, numEvents) => {
  numEvents = (numEvents || 1);

  const api = '/events/' + element;
  const options = { headers: { 'Element-Instances': eiId } };

  logger.debug('Attempting to send %s events to %s', numEvents, api);
  let promises = [];
  for (var i = 0; i < numEvents; i++) {
    const response = chakram.post(api, payload, options);
    promises.push(response);
  }
  return chakram.all(promises);
};
exports.createEvents = createEvents;

const listenForEvents = (port, numEventsSent, waitSecs) => {
  let receivedEvents = 0;
  let events = [];
  return new Promise((resolve, reject) => {
    http.createServer((request, response) => {
        var fullBody = '';
        request.on('data', function (chunk) {
          fullBody += chunk.toString();
        });
        request.on('end', function () {
          request.body = fullBody;
        });

        response.end('{}');
        receivedEvents++;
        events.push(request);
        logger.debug('%s event(s) received', receivedEvents);
        if (receivedEvents === numEventsSent) resolve(events);
      })
      .listen(port, "localhost", (err) => {
        err ? reject(err) : logger.debug('Waiting %s seconds to receive %s events on port %s', waitSecs, numEventsSent, port);
      });

    const msg = util.format('Did not receive all %s events before the %s second timer expired', numEventsSent, waitSecs);
    setTimeout(() => reject(msg), waitSecs * 1000);
  });
};
exports.listenForEvents = listenForEvents;
