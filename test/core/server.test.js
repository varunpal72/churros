'use strict';

require('core/assertions');
const server = require('core/server');
const chakram = require('chakram');
const expect = chakram.expect;

describe('server', () => {
  before(() => chakram.setRequestDefaults({ headers: { 'User-Agent': 'churros-test' } }));

  beforeEach(() => server.stop()); // just in case ...

  const port = 8086;

  it('should allow starting http server', () => {
    return server.start(port)
      .then(r => chakram.post('http://localhost:' + port, { event: 'green hat' }))
      .then(r => expect(r).to.have.statusCode(502));
  });

  it('should support listening for events with custom validation', () => {
    return server.start(port)
      .then(s => {
        return new Promise((res, rej) => {
          server.listen(1, 5)
            .then(r => r.forEach(e => expect(e).to.not.be.empty))
            .then(r => res(r))
            .catch(r => rej('How embarrassing, I failed validating events: ' + r));
          return chakram.post('http://localhost:' + port, { event: 'green hat' });
        });
      });
  });

  it('should throw an error if event validation fails', () => {
    return server.start(port)
      .then(s => {
        return new Promise((res, rej) => {
          server.listen(1, 5)
            .then(r => r.forEach(e => expect(e).to.be.empty))
            .then(r => rej('How embarrassing, I should have failed validating events: ' + r))
            .catch(r => res(r));
          return chakram.post('http://localhost:' + port, { event: 'green hat' });
        });
      });
  });

  it('should throw an error if event listen times out', () => {
    return server.start(port)
      .then(s => {
        return new Promise((res, rej) => {
          server.listen(1, 1)
            .then(r => rej('How embarrassing, I should have timed out listening for events: ' + r))
            .catch(r => res(r));
        });
      });
  });

  it('should not allow starting a server if one is already started', () => {
    return server.start(port)
      .then(s => server.start(port))
      .then(s => {
        throw Error('This should not have happened...');
      })
      .catch(r => {
        expect(r.message).to.contain('already running');
      });
  });

  it('should allow starting, stopping and then starting a server', () => {
    return server.start(port)
      .then(s => server.stop())
      .then(s => server.start(port));
  });
});
