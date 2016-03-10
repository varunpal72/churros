'use strict';

const server = require('core/server');
const chakram = require('chakram');
const expect = chakram.expect;

describe('server', () => {
  before(() => chakram.setRequestDefaults({ headers: { 'User-Agent': 'churros-test' } }));

  it('should allow starting http server', () => {
    const port = 8086;
    let myServer;
    return server.start(port)
      .then(s => myServer = s)
      .then(r => chakram.post('http://localhost:' + port, { event: 'green hat' }))
      .then(r => expect(r).to.have.statusCode(502))
      .then(r => myServer.destroy())
      .catch(r => {
        myServer.destroy();
        throw r;
      });
  });

  it('should support listening for events with custom validation', () => {
    const port = 8086;
    return server.start(port)
      .then(myServer => {
        return new Promise((res, rej) => {
          server.listen(myServer, 1, 5)
            .then(r => r.forEach(e => expect(e).to.not.be.empty))
            .then(r => res(r))
            .catch(r => rej('How embarrassing, I failed validating events: ' + r));
          return chakram.post('http://localhost:' + port, { event: 'green hat' });
        });
      });
  });

  it('should throw an error if event validation fails', () => {
    const port = 8086;
    return server.start(port)
      .then(myServer => {
        return new Promise((res, rej) => {
          server.listen(myServer, 1, 5)
            .then(r => r.forEach(e => expect(e).to.be.empty))
            .then(r => rej('How embarrassing, I should have failed validating events: ' + r))
            .catch(r => res(r));
          return chakram.post('http://localhost:' + port, { event: 'green hat' });
        });
      });
  });

  it('should throw an error if event listen times out', () => {
    const port = 8086;
    return server.start(port)
      .then(myServer => {
        return new Promise((res, rej) => {
          server.listen(myServer, 1, 1)
            .then(r => rej('How embarrassing, I should have timed out listening for events: ' + r))
            .catch(r => res(r));
        });
      });
  });

});
