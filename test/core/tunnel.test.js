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
const fs = require('fs');

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

  it('should preserve an ngrok2 config file if present', () => {
    const baseDir = `${process.env.HOME}/.ngrok2`;
    const path = `${baseDir}/ngrok.yml`;
    if (fs.existsSync(path)) return; // only run if this machine does NOT have an ngrok config file


    // create folder, if not exists
    var didCreateDir = false;
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
      didCreateDir = true;
    }

    // create tmp file
    const contents = 'authtoken: fake';
    fs.writeFileSync(path, contents);

    return tunnel.start(port, 'fakeauthtoken')
      .then(url => expect(url).to.be.a('string'))
      .then(() => {
        // make sure it's the same as it was before running tunnel.start
        const config = fs.readFileSync(path).toString('utf8');
        expect(config).to.be.a('string');
        expect(config).to.equal(contents);
      })
      .then(() => {
        // cleanup
        fs.unlink(path);
        if (didCreateDir) fs.rmdirSync(baseDir);
      });
  });
});
