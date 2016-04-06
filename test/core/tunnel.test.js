'use strict';

const tunnel = require('core/tunnel');
const expect = require('chakram').expect;

describe('tunnel', () => {
  it('should support starting up a publicly available HTTP server', () => {
    const port = 8999;
    return tunnel.start(port)
      .then(url => expect(url).to.be.a('string'));
  });
});
