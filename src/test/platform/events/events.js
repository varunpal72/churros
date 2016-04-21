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
const eventsSchema = require('./assets/events.schema.json');

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

suite.forPlatform('events', (test) => {
  let instanceId;
  const element = props.getForKey('events', 'element');
  before(done => provisioner.create(element, gen({}, props.getForKey('events', 'url')))
    .then(r => instanceId = r.body.id)
    .then(r => done()));

  after(done => provisioner.delete(instanceId)
    .then(r => done()));

  it('should handle receiving x number of events for an element instance', () => {
    const payload = loadPayload(element);
    const load = props.getForKey('events', 'load');
    const wait = props.getForKey('events', 'wait');

    let eventId, eventIds = [], eventMap = {};
    return cloud.createEvents(element, instanceId, payload, load)
      .then(s => server.listen(load, wait))
      .then(r => r.forEach(event => {
        // basic event header and body validation
        expect(event.headers).to.not.be.empty;
        expect(event.body).to.not.be.empty;
        // validate webhook signature
        expect(event.headers['elements-webhook-id']).to.not.be.empty;
        expect(event.headers['elements-webhook-signature']).to.not.be.empty;
        const signature = event.headers['elements-webhook-signature'];
        const hash = 'sha256=' + crypto.createHmac('sha256', signatureKey).update(event.body).digest('base64');
        expect(signature).to.equal(hash);
        let eventJson = JSON.parse(event.body);
        let eventId = eventJson.message.eventId;
        eventIds.push(eventId);
        expect(eventMap[eventId]).to.be.empty;
        eventMap[eventId] = eventJson;
      }))
      .then(r => eventId = eventIds[0])
      .then(r => cloud.get(`instances/${instanceId}/events`, eventsSchema))
      .then(r => cloud.withOptions({ qs: { pageSize: 10 } }).get('instances/events', eventsSchema))
      .then(r => cloud.get(`instances/events/${eventId}`, event => {
        expect(event).to.have.schemaAnd200(eventSchema);
        expect(event.body.status).to.equal('NOTIFIED');
      }))
      .then(r => cloud.get(`instances/${instanceId}/events/${eventId}`, event => {
        expect(event).to.have.schemaAnd200(eventSchema);
        expect(event.body.status).to.equal('NOTIFIED');
      }));
  });

});
