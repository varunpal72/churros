'use strict';

const common = require('./common');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const server = require('core/server');
const provisioner = require('core/provisioner');
const props = require('core/props');
const logger = require('winston');
const crypto = require('crypto');
const tools = require('core/tools');
const eventSchema = require('./assets/event.schema.json');
const eventsSchema = require('./assets/events.schema.json');

const signatureKey = 'abcd1234efgh5678';

suite.forPlatform('events', (test) => {
  let instanceId;
  const element = props.getForKey('events', 'element');
  before(done => provisioner.create(element, common.gen({}, props.getForKey('events', 'url'), signatureKey))
    .then(r => instanceId = r.body.id)
    .then(r => done()));

  after(done => provisioner.delete(instanceId)
    .then(r => done()));

  it('should handle receiving x number of events for an element instance', () => {
    const payload = common.loadEventRequest(element);
    const load = props.getForKey('events', 'load');
    const wait = props.getForKey('events', 'wait');

    let eventId, eventIds = [], eventMap = {}, failed;
    return cloud.createEvents(element, { '<elementInstanceId>': instanceId }, payload, load)
      .then(sentEvents => failed = sentEvents.filter(event => event.error).length)
      .then(r => { if (failed > 0) logger.warn("Failed to POST %d events", failed); })
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
      .then(r => tools.wait.upTo(10000).for(() => cloud.get(`instances/${instanceId}/events`, eventsSchema)))
      .then(r => tools.wait.upTo(10000).for(() => cloud.withOptions({ qs: { pageSize: 10 } }).get('instances/events', eventsSchema)))
      .then(r => tools.wait.upTo(10000).for(() => cloud.get(`instances/events/${eventId}`, event => {
        expect(event).to.have.schemaAnd200(eventSchema);
        expect(event.body.status).to.equal('NOTIFIED');
      })))
      .then(r => tools.wait.upTo(10000).for(() => cloud.get(`instances/${instanceId}/events/${eventId}`, event => {
        expect(event).to.have.schemaAnd200(eventSchema);
        expect(event.body.status).to.equal('NOTIFIED');
      })));
  });

});
