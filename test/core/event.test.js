'use strict';

require('core/assertions');
require('core/logger')('debug');
const cloud = require('core/cloud');
const nock = require('nock');
const chakram = require('chakram');
const expect = chakram.expect;
const fs = require('fs');

const baseUrl = 'https://api.cloud-elements.com/elements/api-v2;';
const auth = 'User fake, Organization fake';
const eiId = 789;

const headers = () => new Object({ reqheaders: { 'Authorization': (value) => value === auth } });

const eventHeaders = () => new Object({
  reqheaders: {
    'Authorization': (value) => value === auth,
    'Element-Instances': (value) => value === eiId
  }
});

const genPayload = (opts) => {
  opts = opts || {};
  return new Object({
    id: (opts.id || null),
    foo: (opts.foo || 'bar')
  });
};

const genSchema = () => new Object({
  type: ['object', 'array'],
  properties: {
    id: { type: "number" },
    foo: { type: "string" }
  },
  required: ['id', 'foo']
});

beforeEach(() => {
  chakram.setRequestDefaults({
    baseUrl: baseUrl,
    headers: { Authorization: auth }
  });

  nock(baseUrl, eventHeaders())
    .post('/events/myelement')
    .reply(200, (uri, requestBody) => requestBody);

});

describe('cloud', () => {

  it('should support creating events', () => cloud.createEvents('myelement', eiId, genPayload(), 2));

  it('should support listening for events with custom validation', () => {
    var listener = cloud.EventListener();
    return new Promise((res, rej) => {
      const port = 8085;
      listener.listen(port, 1, 5)
        .then(r => r.forEach(e => expect(e).to.not.be.empty))
        .then(r => res(r))
        .catch(r => rej('How embarrassing, I failed validating events: ' + r));
      chakram.setRequestDefaults({ headers: { 'User-Agent': 'churros-test' } });
      return chakram.post('http://localhost:' + port, { event: 'green hat' });
    })
    .then(listener.shutdown())
    .catch(listener.shutdown());
  });

  it('should throw an error if event validation fails', () => {
    var listener = cloud.EventListener();
    return new Promise((res, rej) => {
      const port = 8085;
      listener.listen(port, 1, 5)
        .then(r => r.forEach(e => expect(e).to.be.empty))
        .then(r => rej('How embarrassing, I should have failed validating events: ' + r))
        .catch(r => res(r));
      chakram.setRequestDefaults({ headers: { 'User-Agent': 'churros-test' } });
      return chakram.post('http://localhost:' + port, { event: 'green hat' });
    })
    .then(listener.shutdown())
    .catch(listener.shutdown());
  });

});
