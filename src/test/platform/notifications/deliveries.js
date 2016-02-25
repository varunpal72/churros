'use strict';

const chakram = require('chakram');
const expect = require('chakram').expect;
const logger = require('winston');
const util = require('util');
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
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
  topics: (opts.topics || [ 'churros-topic' ]),
  config: (opts.config || { url: 'http://fake.churros.api.com' })
});

suite.forPlatform('notifications/subscriptions/deliveries', genSub({}), schema, (test) => {
  it('should return notification subscription delivery status', () => {
    const topic = 'churros-topic-' + tools.random();
    const n = genNotif({ topic: topic });
    const s = genSub({ topics: [ topic ] });
    const load = 2;
    let promises = [];
    for (let i = 0; i < load; i++) {
      promises.push(cloud.post("notifications/subscriptions", s));
    }
    let subs = [];
    let nId;
    let sId;

    return chakram.all(promises)
      .then(r => {
        r.forEach(sr => subs.push(sr));
        return cloud.post("notifications", n)
      })
      .then(r => {
        nId = r.body.id;
        sId = subs[ 0 ].body.id;
        // test get by notification id and subscription id
        return cloud.withOptions({ qs: { hydrate: true } }).get(util.format('notifications/%s/subscriptions/%s/deliveries', nId, sId),
          (r) => {
            expect(r).to.have.schemaAnd200(schema);
            expect(r.body).to.not.be.empty;
            expect(r.body.notificationId).to.equal(nId);
            expect(r.body.subscriptionId).to.equal(sId);
            expect(r.body.notification).to.not.be.empty;
            expect(r.body.subscription).to.not.be.empty;
          })
      })
      .then(r => {
        // test get all by notification id
        return cloud.get(util.format('notifications/%s/subscriptions/deliveries', nId), (r) => {
          expect(r).to.have.schemaAnd200(listSchema);
          expect(r.body).to.not.be.empty;
          expect(r.body.length).to.equal(load);
        })
      })
      // test search
      .then(r => {
        return cloud.withOptions({ qs: { hydrate: true, where: "channel='webhook'" } }).get('notifications/subscriptions/deliveries', (r) => {
          expect(r).to.have.schemaAnd200(listSchema);
          r.body.forEach(s => expect(s.subscription.channel).to.equal('webhook'));
        })
      })
      .then(r => subs.forEach(sub => cloud.delete(util.format('/notifications/subscriptions/%s', sub.body.id))));
  });

  it('should retry webhook delivery', () => {
    const topic = 'churros-topic-' + tools.random();
    const n = genNotif({ topic: topic });
    const s = genSub(
      {
        topics: [ topic ],
        config: {
          url: 'http://localhost:8085'
        }
      });
    // TODO update account webhook failure delivery preferences to 'retry'
    // create a subscription
    let sId;
    let nId;
    return cloud.post("notifications/subscriptions", s)
      .then(r => {
        sId = r.body.id;
        // send a notification
        return cloud.post("notifications", n);
      })
      .then(r => {
        nId = r.body.id;
        return new Promise((res, rej) => {
          // wait a few seconds for delivery to fail
          setTimeout(() => res(), 3000);
        });
      })
      .then(r => {
        return cloud.withOptions({ qs: { hydrate: true } }).get(util.format('notifications/%s/subscriptions/%s/deliveries', nId, sId),
          (r) => {
            expect(r.body).to.not.be.empty;
            expect(r.body.status).to.equal('retry');
          })
      })
      .then(r => {
        return cloud.listenForEvents(8085, 1, 10)
      })
      .then(r => {
        return cloud.withOptions({ qs: { hydrate: true } }).get(util.format('notifications/%s/subscriptions/%s/deliveries', nId, sId),
          (r) => {
            expect(r.body).to.not.be.empty;
            expect(r.body.status).to.equal('delivered');
          });
      })
  });
});
