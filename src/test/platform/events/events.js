'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const server = require('core/server');
const provisioner = require('core/provisioner');
const props = require('core/props');
const logger = require('winston');
const crypto = require('crypto');
const eventSchema = require('./assets/event.schema.json');

const signatureKey = 'abcd1234efgh5678';
const gen = (opts, url) => ({
  'event.notification.enabled': opts['event.notification.enabled'] || true,
  'event.notification.callback.url': url,
  'event.notification.signature.key': signatureKey
});

const loadPayload = (element) => {
  try {
    return require(`./assets/${element}.event.json`);
  } catch (e) {
    logger.error('No %s.event.json file found in the events/assets directory.  Please create this file before this element can be tested with events', element);
    process.exit(1);
  }
};

suite.forPlatform('events', null, null, (test) => {
  it('should handle receiving x number of events for an element instance', () => {
    const element = props.getForKey('events', 'element');
    const payload = loadPayload(element);
    const load = props.getForKey('events', 'load');
    const wait = props.getForKey('events', 'wait');
    const url = props.getForKey('events', 'url');

    let instanceId;
    return provisioner.create(element, gen({}, url))
      .then(r => instanceId = r.body.id)
      .then(r => cloud.createEvents(element, instanceId, payload, load))
      .then(s => server.listen(load, wait))
      .then(r => r.forEach(event => {
        // basic event header and body validation
        expect(event.headers).to.not.be.empty;
        expect(event.body).to.not.be.empty;
        // validate webhook signature
        expect(event.headers['elements-webhook-id']).to.not.be.empty;
        expect(event.headers['elements-webhook-signature']).to.not.be.empty;
        const signature = event.headers['elements-webhook-signature'];
        const hash = 'sha1=' + crypto.createHmac('sha1', signatureKey).update(event.body).digest('base64');
        expect(signature).to.equal(hash);
      }))
      .then(r => cloud.get(`instances/${instanceId}/events`, eventSchema))
      .then(r => provisioner.delete(instanceId));
  });

});
