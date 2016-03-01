'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');
const util = require('util');
const props = require('core/props');
const logger = require('winston');
const crypto = require('crypto');
const eventSchema = require('./assets/event.schema.json');

const signatureKey = 'abcd1234efgh5678';
const gen = (opts, url) => new Object({
  'event.notification.enabled': opts['event.notification.enabled'] || true,
  'event.notification.callback.url': url,
  'event.notification.signature.key': signatureKey
});

const loadPayload = (element) => {
  try {
    return require(util.format('./assets/%s.event.json', element));
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
    const port = props.getForKey('events', 'port');
    const url = props.getForKey('events', 'url');

    let instanceId;
    return provisioner.create(element, gen({}, url))
      .then(r => instanceId = r.body.id)
      .then(r => cloud.createEvents(element, instanceId, payload, load))
      .then(r => cloud.startServer(port))
      .then(s => cloud.listenForEvents(s, load, wait))
      .then(r => r.forEach(event => {
        // basic event header and body validation
        expect(event.headers).to.not.be.empty;
        expect(event.body).to.not.be.empty;
        // validate webhook signature
        expect(event.headers['elements-webhook-id']).to.not.be.empty;
        expect(event.headers['elements-webhook-signature']).to.not.be.empty;
        var signature = event.headers['elements-webhook-signature'];
        var hash = 'sha1=' + crypto.createHmac('sha1', signatureKey).update(event.body).digest('base64');
        expect(signature).to.equal(hash);
      }))
      .then(r => cloud.get(util.format('instances/%s/events', instanceId), eventSchema))
      .then(r => provisioner.delete(instanceId));
  });

});
