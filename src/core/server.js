'use strict';

const http = require('http');
const logger = require('winston');

var exports = module.exports = {};

/**
 * Global HTTP server object, that represents the current server that is listening for incoming HTTP requests
 * @type {object} The HTTP server
 */
let server = null;

/**
 * Global handlerCb function defines how this server will handle any incoming HTTP requests
 * @type {function}
 */
let handlerCb = null;

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

const handlerCbs = {
  502: (req, res) => {
    res.writeHead(502, { 'Content-Type': "application/json" });
    res.end(JSON.stringify({ message: 'Simulating bad gateway' }));
    logger.debug("Received message and responded with 502");
  }
};

const setHandler = (h) => handlerCb = (typeof h === 'function' ? h : null);

const getHandler = () => handlerCb || handlerCbs['502'];

/**
 * Start the HTTP server
 * @param  {number} port The port to listen on
 * @return {Promise}     A promise that, when resolved, contains the server that was just started
 */
exports.start = (port) => {
  if (server) {
    throw Error('Server is already running.  Please stop the current server (call "server.stop()") before trying to start a new one.');
  }

  return new Promise((resolve, reject) => {
    server = createServer((request, response) => getHandler()(request, response));
    server.listen(port, "localhost", (err) => {
      logger.debug('Started HTTP server on port %d', port);
      resolve(server);
    });
  });
};

/**
 * If an HTTP server is running, this stops that server
 */
exports.stop = () => {
  if (server) {
    server.destroy();
    server = null;
  }
};

/**
 * Toggle the server to "listen" mode, which will listen for x number of incoming events before resolving
 * @param  {number} numEventsSent The number of events that were sent
 * @param  {number} waitSecs      How long to wait for incoming events
 * @return {Promise}              A promise that, when resolved, will contain all of the incoming HTTP requests that came in
 */
exports.listen = (numEventsSent, waitSecs) => {
  return new Promise((resolve, reject) => {
    let receivedEvents = 0;
    let events = [];
    setHandler((request, response) => {
      let fullBody = '';
      request.on('data', (chunk) => fullBody += chunk.toString());
      request.on('end', () => {
        request.body = fullBody;
        response.end('{}');

        receivedEvents++;
        events.push(request);
        logger.debug('%s event(s) received', receivedEvents);
        if (receivedEvents === numEventsSent) {
          setHandler(null);
          resolve(events);
        }
      });
    });

    logger.debug('Waiting %s seconds to receive %s events', waitSecs, numEventsSent);
    setTimeout(() => reject(new Error(`Did not receive all ${numEventsSent} events before the ${waitSecs} second timer expired`)), waitSecs * 1000);
  });
};
