'use strict';

/* MOCKING OUT THE ngrok module here */
const mockery = require('mockery');
mockery.registerMock('ngrok', {
  connect: (opts, cb) => {
    if (opts.error) cb('Error fool', null);
    cb(null, 'http://fakeurl.ngrok.io');
  }
});
mockery.enable({ warnOnReplace: false, warnOnUnregistered: false });
/****************************************/

const tunnel = require('core/tunnel');
const expect = require('chakram').expect;

describe('tunnel', () => {
  const port = 8999;

  it('should support starting up a publicly available HTTP tunnel', () => {
    return tunnel.start(port)
      .then(url => expect(url).to.be.a('string'));
  });

  it('should fail if a tunnel is already started', () => {
    return tunnel.start(port)
      .then(() => tunnel.start({ port: port, error: true }))
      .catch(r => true);
  });
});
