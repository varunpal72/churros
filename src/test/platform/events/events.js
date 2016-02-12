'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');
const util = require('util');
const props = require('core/props');
const logger = require('winston');
const crypto = require('cryptojs')

const signatureKey = 'abcd1234efgh5678';
const gen = (opts) => new Object({
  'event.notification.enabled': opts['event.notification.enabled'] || true,
  'event.notification.callback.url': opts['event.notification.callback.url'] || props.getForKey('events', 'url'),
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

    let instanceId;
    return provisioner.create(element, gen({}))
      .then(r => instanceId = r.body.id)
      .then(r => cloud.createEvents(element, instanceId, payload, load))
      .then(r => cloud.listenForEvents(port, load, wait, (event) => {
        throw "garbage";
        logger.info(event.headers);
        logger.info(event.body);
        expect(event.headers).to.not.be.empty;
        expect(event.body).to.not.be.empty;
        expect(event.headers['elements-webhook-id']).to.not.be.empty;
        expect(event.headers['elements-webhook-signature']).to.not.be.empty;
        var signature = event.headers['elements-webhook-signature'];
        logger.info(signature);
        var hash = 'sha1=' + crypto.HmacSHA1(event.body, signatureKey);
        logger.info(hash);
        expect(signature).to.equal(hash);
      }))
      .then(r => provisioner.delete(instanceId));
  });
});
