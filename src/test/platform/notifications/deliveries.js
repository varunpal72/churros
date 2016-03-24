'use strict';

const chakram = require('chakram');
const expect = require('chakram').expect;
const logger = require('winston');
const props = require('core/props');
const suite = require('core/suite');
const cloud = require('core/cloud');
const server = require('core/server');
const tools = require('core/tools');
const persister = require('./assets/persister');
const sleep = require('sleep');

const schema = require('./assets/delivery.schema.json');
const listSchema = require('./assets/deliveries.schema.json');

const genNotif = (opts) => new Object({
  severity: (opts.severity || 'low'),
  topic: (opts.topic || 'churros-topic'),
  message: (opts.message || 'this is a test message'),
  from: (opts.from || 'churros')
});

const genSub = (opts) => new Object({
  channel: (opts.channel || 'webhook'),
  topics: (opts.topics || ['churros-topic']),
  config: (opts.config || { url: 'http://fake.churros.api.com' })
});

const genSettings = (policy) => ({ 'notification.webhook.failure.policy': policy });

suite.forPlatform('notifications/subscriptions/deliveries', genSub({}), schema, (test) => {
  before(() => persister.snapshot());
  after(() => persister.restore());

  it('should return notification subscription delivery status', () => {
    const topic = 'churros-topic-' + tools.random();
    const n = genNotif({ topic: topic });
    const s = genSub({ topics: [topic] });
    const load = 2;
    let promises = [];
    // sleep for half second here, as if you try to create two subscriptions at once, with the same topic, they might both try to create
    // that topic.  we fail properly, however we still fail...
    promises.push(cloud.post("notifications/subscriptions", s));
    sleep.sleep(1);
    for (let i = 0; i < load - 1; i++) {
      promises.push(cloud.post("notifications/subscriptions", s));
    }

    let subs = [];
    let nId;
    let sId;
    return chakram.all(promises)
      .then(r => r.forEach(sr => subs.push(sr)))
      .then(r => cloud.post("notifications", n)) // create a notification
      .then(r => {
        nId = r.body.id;
        sId = subs[0].body.id;
      })
      .then(r => cloud.withOptions({ qs: { hydrate: true } }).get(`notifications/${nId}/subscriptions/${sId}/deliveries`)) // retrieve subscription deliveries
      .then(r => {
        expect(r).to.have.schemaAnd200(schema);
        expect(r.body).to.not.be.empty;
        expect(r.body.notificationId).to.equal(nId);
        expect(r.body.subscriptionId).to.equal(sId);
        expect(r.body.notification).to.not.be.empty;
        expect(r.body.subscription).to.not.be.empty;
      })
      .then(r => cloud.get(`notifications/${nId}/subscriptions/deliveries`))
      .then(r => {
        expect(r).to.have.schemaAnd200(listSchema);
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.equal(load);
      })
      .then(r => cloud.withOptions({ qs: { hydrate: true, where: "channel='webhook'" } }).get('notifications/subscriptions/deliveries'))
      .then(r => {
        expect(r).to.have.schemaAnd200(listSchema);
        r.body.forEach(s => expect(s.subscription.channel).to.equal('webhook'));
      })
      .then(r => subs.forEach(sub => cloud.delete(`/notifications/subscriptions/${sub.body.id}`)));
  });

  it('should retry webhook delivery', () => {
    const topic = 'churros-topic-' + tools.random();
    const n = genNotif({ topic: topic });
    const s = genSub({
      topics: [topic],
      config: { url: props.getForKey('events', 'url') }
    });

    let sId;
    let nId;
    return cloud.patch("accounts/settings", genSettings('retry')) // update account webhook failure delivery preferences to 'retry'
      .then(r => cloud.post("notifications/subscriptions", s)) // create a subscription
      .then(r => sId = r.body.id)
      .then(r => cloud.post("notifications", n)) // send a notification
      .then(r => {
        nId = r.body.id;
        logger.debug("Waiting for webhook delivery to fail");
        return new Promise((res, rej) => setTimeout(() => res(), 5000)); // wait a few seconds for delivery to fail
      })
      .then(r => cloud.withOptions({ qs: { hydrate: true } }).get(`notifications/${nId}/subscriptions/${sId}/deliveries`))
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.status).to.equal('retry');
      })
      .then(r => server.listen(1, 20))
      .then(r => {
        logger.debug("Waiting for delivery status to update");
        return new Promise((res, rej) => setTimeout(() => res(), 1000)); // wait a bit for status to update
      })
      .then(r => cloud.withOptions({ qs: { hydrate: true } }).get(`notifications/${nId}/subscriptions/${sId}/deliveries`))
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.status).to.equal('delivered');
      })
      .then(r => cloud.delete(`/notifications/subscriptions/${sId}`))
      .catch(err => {
        // if anything bad happens, clean up the subscription
        return cloud.delete(`/notifications/subscriptions/${sId}`)
          .then(r => {
            throw err;
          });
      });
  });

  it('should queue webhook delivery', () => {
    if (props.get('user') === 'system') {
      logger.warn("Unable to run webhook queueing test as system user. Run as a different user to test this feature.");
      return;
    }

    const eventsUrl = props.getForKey('events', 'url');
    const topic = 'churros-topic-' + tools.random();
    const n = genNotif({ topic: topic });
    const s = genSub({
      topics: [topic],
      config: { url: eventsUrl }
    });

    let sId;
    let nId;
    return cloud.patch("accounts/settings", genSettings('queue')) // update account webhook failure delivery preferences to 'queue'
      .then(r => cloud.post("notifications/subscriptions", s)) //create a subscription
      .then(r => sId = r.body.id)
      .then(r => cloud.post("notifications", n)) // send a notification
      .then(r => nId = r.body.id)
      .then(r => new Promise((res, rej) => setTimeout(() => res(), 5000))) // wait a few seconds for delivery to fail
      .then(r => cloud.withOptions({ qs: { hydrate: true } }).get(`notifications/${nId}/subscriptions/${sId}/deliveries`)) // get delivery status, verify it is queued
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.status).to.equal('queued');
      })
      .then(r => server.listen(1, 10)) // listen for events
      .catch(r => cloud.withOptions({ qs: { hydrate: true } }).get(`notifications/${nId}/subscriptions/${sId}/deliveries`)) // get delivery status, verify it is _still_ queued
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.status).to.equal('queued');
      })
      .then(r => {
        const listener = server.listen(1, 10);
        const opts = { qs: { hydrate: true, where: `channel='webhook' and status='queued' and config.url='${eventsUrl}'` } };
        cloud.withOptions(opts).put('notifications/subscriptions/deliveries'); // release the queue for delivery
        return listener;
      })
      .then(r => cloud.delete(`/notifications/subscriptions/${sId}`))
      .catch(err => {
        // if anything bad happens, clean up the subscription
        return cloud.delete(`/notifications/subscriptions/${sId}`)
          .then(r => {
            throw err;
          });
      });
  });
});
