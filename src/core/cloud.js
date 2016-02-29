'use strict';

const tools = require('core/tools');
const http = require('http');
const fs = require('fs');
const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const logger = require('winston');

var exports = module.exports = {};

const validator = (validationCb) => {
  if (typeof validationCb === 'function') {
    return (r) => {
      validationCb(r);
      return r;
    };
  } else if (typeof validationCb === 'undefined' || (typeof validationCb === 'object' && validationCb === null)) {
    return (r) => {
      expect(r).to.have.statusCode(200);
      return r;
    };
  } else {
    // assuming this is an actual schema at this point...if it's not, this will fail miserably
    return (r) => {
      expect(r).to.have.schemaAnd200(validationCb);
      return r;
    };
  }
};

const post = (api, payload, validationCb, options) => {
  logger.debug('POST %s with options %s', api, options);
  return chakram.post(api, payload, options)
    .then(r => validator(validationCb)(r))
    .catch(r => tools.logAndThrow('Failed to create %s', r, api));
};
exports.post = (api, payload, validationCb) => post(api, payload, validationCb, null);

const get = (api, validationCb, options) => {
  logger.debug('GET %s with options %s', api, options);
  return chakram.get(api, options)
    .then(r => validator(validationCb)(r))
    .catch(r => tools.logAndThrow('Failed to retrieve %s', r, api));
};
exports.get = (api, validationCb) => get(api, validationCb, null);

const update = (api, payload, validationCb, chakramCb, options) => {
  chakramCb = (chakramCb || chakram.patch);
  logger.debug('%s %s with options %s', chakramCb === chakram.patch ? 'PATCH' : 'PUT', api, options);

  return chakramCb(api, payload, options)
    .then(r => validator(validationCb)(r))
    .catch(r => tools.logAndThrow('Failed to update %s', r, api));
};
exports.update = (api, payload, validationCb, chakramCb) => update(api, payload, validationCb, chakramCb, null);

const patch = (api, payload, validationCb, options) => update(api, payload, validationCb, chakram.patch, options);
exports.patch = (api, payload, validationCb) => patch(api, payload, validationCb, null);

const put = (api, payload, validationCb, options) => update(api, payload, validationCb, chakram.put, options);
exports.put = (api, payload, validationCb) => put(api, payload, validationCb, null);

const remove = (api, options) => {
  logger.debug('DELETE %s with options %s', api, options);
  return chakram.delete(api, options)
    .then(r => {
      expect(r).to.have.statusCode(200);
      return r;
    })
    .catch(r => tools.logAndThrow('Failed to delete %s', r, api));
};
exports.delete = (api) => remove(api, null);

const postFile = (api, filePath, options) => {
  options = (options || {});
  options.formData = { file: fs.createReadStream(filePath) };

  return chakram.post(api, undefined, options)
    .then(r => validator(undefined)(r))
    .catch(r => tools.logAndThrow('Failed to upload file to %s', r, api));
};
exports.postFile = postFile;

/*
 * Gives you access to adding HTTP request options to any of the HTTP-related APIs
 */
exports.withOptions = (options) => {
  return {
    post: (api, payload, validationCb) => post(api, payload, validationCb, options),
    postFile: (api, filePath) => postFile(api, filePath, options),
    put: (api, payload, validationCb) => put(api, payload, validationCb, options),
    patch: (api, payload, validationCb) => patch(api, payload, validationCb, options),
    get: (api, validationCb) => get(api, validationCb, options),
    delete: (api, validationCb) => remove(api, options)
  };
};

const crd = (api, payload, validationCb) => {
  return post(api, payload, validationCb)
    .then(r => get(api + '/' + r.body.id, validationCb))
    .then(r => remove(api + '/' + r.body.id));
};
exports.crd = crd;

const crds = (api, payload, validationCb) => {
  let createdId = -1;
  return post(api, payload, validationCb)
    .then(r => createdId = r.body.id)
    .then(r => get(api + '/' + createdId, validationCb))
    .then(r => get(api, validationCb))
    .then(r => remove(api + '/' + createdId));
};
exports.crds = crds;

const crud = (api, payload, validationCb, updateCb) => {
  return post(api, payload, validationCb)
    .then(r => get(api + '/' + r.body.id, validationCb))
    .then(r => update(api + '/' + r.body.id, payload, validationCb, updateCb))
    .then(r => remove(api + '/' + r.body.id));
};
exports.crud = crud;

const cruds = (api, payload, validationCb, updateCb) => {
  let createdId = -1;
  return post(api, payload, validationCb)
    .then(r => createdId = r.body.id)
    .then(r => get(api + '/' + createdId, validationCb))
    .then(r => update(api + '/' + createdId, payload, validationCb, updateCb))
    .then(r => get(api, validationCb))
    .then(r => remove(api + '/' + createdId));
};
exports.cruds = cruds;

const sr = (api, validationCb) => {
  return get(api, validationCb)
    .then(r => get(api + '/' + r.body[0].id, validationCb));
};
exports.sr = sr;

const createEvents = (element, eiId, payload, numEvents) => {
  numEvents = (numEvents || 1);

  const api = '/events/' + element;
  const options = { headers: { 'Element-Instances': eiId } };

  logger.debug('Attempting to send %s events to %s', numEvents, api);
  let promises = [];
  for (let i = 0; i < numEvents; i++) {
    const response = chakram.post(api, payload, options);
    promises.push(response);
  }
  return chakram.all(promises);
};
exports.createEvents = createEvents;

const createServer = (cb) => {
  const sx = {};
  const sv = http.createServer(cb);
  sv.on('connection', s => {
    const k = `${s.remoteAddress}:${s.remotePort}`;
    sx[k] = s;
    s.once('close', () => delete sx[k]);
  });

  sv.destroy = f => {
    sv.close(f);
    for (let s in sx) {
      sx[s].destroy();
      sx[s].unref();
    }
    sv.unref();
    return true;
  };
  return sv;
};

const listenForEvents = (port, numEventsSent, waitSecs) => {
  let server;
  let receivedEvents = 0;
  let events = [];
  return new Promise((resolve, reject) => {
    server = createServer((request, response) => {
        let fullBody = '';
        request.on('data', (chunk) => fullBody += chunk.toString());
        request.on('end', () => {
          request.body = fullBody
          response.end('{}');

          receivedEvents++;
          events.push(request);
          logger.debug('%s event(s) received', receivedEvents);
          if (receivedEvents === numEventsSent) {
            resolve(events);
            server.destroy();
          }
        });
      })
      .listen(port, "localhost", (err) => {
        err ? reject(err) : logger.debug('Waiting %s seconds to receive %s events on port %s', waitSecs, numEventsSent, port);
      });

    const msg = util.format('Did not receive all %s events before the %s second timer expired', numEventsSent, waitSecs);
    setTimeout(() => {
      reject(msg);
      server.destroy();
    }, waitSecs * 1000);
  });
};
exports.listenForEvents = listenForEvents;
