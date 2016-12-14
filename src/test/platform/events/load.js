'use strict';

const chakram = require('chakram');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const server = require('core/server');
const provisioner = require('core/provisioner');
const props = require('core/props');
const logger = require('winston');

const gen = (opts, url) => ({
  'event.notification.enabled': opts[ 'event.notification.enabled' ] || true,
  'event.notification.callback.url': url
});

const loadEventRequest = (element) => {
  try {
    let filename = `./assets/${element}.event.json`;
    delete require.cache[ require.resolve(filename) ];
    return require(filename);
  } catch (e) {
    logger.error('No %s.event.json file found in the events/assets directory.  Please create this file before this element can be tested with events', element);
    process.exit(1);
  }
};

suite.forPlatform('event load', { skip: true }, (test) => {
  let instanceIds = [];
  const element = props.getForKey('events', 'load.element');
  const instances = props.getForKey('events', 'load.instances');
  before(done => {
    logger.info("Creating %d '%s' instances for event load test", instances, element);
    let instancePromises = [];
    for (let i = 0; i < instances; i++) {
      instancePromises.push(provisioner.create(element, gen({}, props.getForKey('events', 'url'))));
    }
    return chakram.all(instancePromises)
      .then(r => instanceIds = r.map(instance => instance.body.id))
      .then(r => done());
  });

  after(done => {
    logger.info("Deleting %d '%s' instances", instances, element);
    let instancePromises = [];
    for (let i = 0; i < instances; i++) {
      instancePromises.push(provisioner.delete(instanceIds[i]));
    }
    return chakram.all(instancePromises)
      .then(r => done());
  });

  it('should handle receiving x number of events for n element instances', () => {
    const payload = loadEventRequest(element);
    const load = props.getForKey('events', 'load.load');
    const wait = props.getForKey('events', 'load.wait');

    let failed;
    let allInstances = instanceIds.join(",");
    return cloud.createEvents(element, { '<elementInstanceId>': allInstances }, payload, load)
      .then(sentEvents => failed = sentEvents.filter(event => event.error).length)
      .then(r => logger.debug("Failed to POST %d events", failed))
      .then(s => server.listen(instances * (load - failed), wait))
      .then(r => r.forEach(event => {
        // basic event header and body validation
        expect(event.headers).to.not.be.empty;
        expect(event.body).to.not.be.empty;
      }));
  });

});
