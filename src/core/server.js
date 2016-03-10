'use strict';

const http = require('http');
const logger = require('winston');

var exports = module.exports = {};

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

const startServer = (port) => {
  return new Promise((resolve, reject) => {
    let server = createServer((request, response) => {
      if (server.handle) {
        server.handle(request, response);
      } else {
        response.writeHead(502, { 'Content-Type': "application/json" });
        response.end('{"message": "Bad Gateway"}');
        logger.debug("Received message and responded with 502 Bad Gateway");
      }
    });
    server.listen(port, "localhost", (err) => {
      logger.debug('Started HTTP server on port %d', port);
      resolve(server);
    });
  });
};
exports.startServer = startServer;

const listenForEvents = (server, numEventsSent, waitSecs) => {
  let receivedEvents = 0;
  let events = [];
  return new Promise((resolve, reject) => {
    server.handle = (request, response) => {
      let fullBody = '';
      request.on('data', (chunk) => fullBody += chunk.toString());
      request.on('end', () => {
        request.body = fullBody;
        response.end('{}');

        receivedEvents++;
        events.push(request);
        logger.debug('%s event(s) received', receivedEvents);
        if (receivedEvents === numEventsSent) {
          resolve(events);
          server.destroy();
        }
      });
    };
    logger.debug('Waiting %s seconds to receive %s events', waitSecs, numEventsSent);
    const msg = `Did not receive all ${numEventsSent} events before the ${waitSecs} second timer expired`;
    setTimeout(() => {
      reject(msg);
      server.destroy();
    }, waitSecs * 1000);
  });
};
exports.listenForEvents = listenForEvents;
