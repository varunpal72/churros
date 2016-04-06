'use strict';

/* MOCKING OUT THE ngrok module here */
const mockery = require('mockery');
mockery.registerMock('ngrok', {
  connect: (opts, cb) => {
    cb(null, 'http://fakeurl.ngrok.io');
  }
});
mockery.enable({ warnOnReplace: false, warnOnUnregistered: false });
/****************************************/

const tunnel = require('core/tunnel');
const expect = require('chakram').expect;

describe('tunnel', () => {
  const port = 8999;

  it('should support starting up a publicly available HTTP tunnel with an auth token', () => {
    return tunnel.start(port, 'fakeauthtoken')
      .then(url => expect(url).to.be.a('string'));
  });

  it('should support starting up a publicly available HTTP tunnel without an auth token', () => {
    return tunnel.start(port)
      .then(url => expect(url).to.be.a('string'));
  });
});
