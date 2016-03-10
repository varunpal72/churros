'use strict';

const server = require('core/server');
const chakram = require('chakram');
const expect = chakram.expect;

describe('server', () => {
  it('should allow starting http server', () => {
    const port = 8085;
    let myServer;
    return server.startServer(port)
      .then(s => {
        myServer = s;
        chakram.setRequestDefaults({ headers: { 'User-Agent': 'churros-test' } });
        return chakram.post('http://localhost:' + port, { event: 'green hat' });
      })
      .then(r => {
        expect(r.response.statusCode).to.equal(502);
      })
      .then(r => myServer.destroy());
  });

  it('should support listening for events with custom validation', () => {
    const port = 8085;
    return server.startServer(port)
      .then(myServer => {
        return new Promise((res, rej) => {
          server.listenForEvents(myServer, 1, 5)
            .then(r => r.forEach(e => expect(e).to.not.be.empty))
            .then(r => res(r))
            .catch(r => rej('How embarrassing, I failed validating events: ' + r));
          chakram.setRequestDefaults({ headers: { 'User-Agent': 'churros-test' } });
          return chakram.post('http://localhost:' + port, { event: 'green hat' });
        });
      });
  });

  it('should throw an error if event validation fails', () => {
    const port = 8085;
    return server.startServer(port)
      .then(myServer => {
        return new Promise((res, rej) => {
          server.listenForEvents(myServer, 1, 5)
            .then(r => r.forEach(e => expect(e).to.be.empty))
            .then(r => rej('How embarrassing, I should have failed validating events: ' + r))
            .catch(r => res(r));
          chakram.setRequestDefaults({ headers: { 'User-Agent': 'churros-test' } });
          return chakram.post('http://localhost:' + port, { event: 'green hat' });
        });
      });
  });

  it('should throw an error if event listen times out', () => {
    const port = 8085;
    return server.startServer(port)
      .then(myServer => {
        return new Promise((res, rej) => {
          server.listenForEvents(myServer, 1, 1)
            .then(r => rej('How embarrassing, I should have timed out listening for events: ' + r))
            .catch(r => res(r));
        });
      });
  });

});
