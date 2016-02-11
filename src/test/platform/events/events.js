'use strict';

const expect = require('chakram').expect;
const tester = require('core/tester');
const provisioner = require('core/provisioner');
const util = require('util');
const props = require('core/props');
const logger = require('winston');

const gen = (opts) => new Object({
  'event.notification.enabled': opts['event.notification.enabled'] || true,
  'event.notification.callback.url': opts['event.notification.callback.url'] || props.getForKey('events', 'url')
});

const loadPayload = (element) => {
  try {
    return require(util.format('./assets/%s.event.json', element));
  } catch (e) {
    logger.error('No %s.event.json file found in the events/assets directory.  Please create this file before this element can be tested with events', element);
    process.exit(1);
  }
};

tester.forPlatform('events', null, null, (suite) => {
  it('should handle receiving x number of events for an element instance', () => {
    const element = props.getForKey('events', 'element');
    const payload = loadPayload(element);
    const load = props.getForKey('events', 'load');
    const wait = props.getForKey('events', 'wait');
    const port = props.getForKey('events', 'port');

    let instanceId;
    return provisioner.create(element, gen({}))
      .then(r => instanceId = r.body.id)
      .then(r => tester.createEvents(element, instanceId, payload, load))
      .then(r => tester.listenForEvents(port, load, wait, (event) => {
        expect(event.headers).to.not.be.empty;
        //expect(event.headers['elements-webhook-signature']).to.not.be.empty;
      }))
      .then(r => provisioner.delete(instanceId));
  });
});
