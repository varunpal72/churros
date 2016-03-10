'use strict';

const tunnel = require('core/tunnel');
const expect = require('chakram').expect;

describe('tunnel', () => {
  it('should support starting up a localtunnel', () => {
    const port = 8085;
    return tunnel.start(port)
      .then(tunnel => {
        expect(tunnel).to.not.be.null;
        expect(tunnel.url).to.be.a('string');
        tunnel.close();
      });
  });
});
