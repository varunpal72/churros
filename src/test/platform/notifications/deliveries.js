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
  it('should return delivery status for notifications and subscriptions', () => {
    const topic = 'churros-topic-' + tools.random();
    const n = genNotif({ topic: topic });
    const s = genSub({ topics: [ topic ] });
    const load = 2;
    let promises = [];
    for (let i = 0; i < load; i++) {
      promises.push(cloud.post("notifications/subscriptions", s));
    }
    let subs = [];

    return chakram.all(promises)
      .then(r => {
        r.forEach(sr => subs.push(sr));
        return cloud.post("notifications", n)
          .then(r => {
            let nId = r.body.id;
            let sId = subs[ 0 ].body.id;

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
              // test get all by notification id
              .then(r => cloud.get(util.format('notifications/%s/subscriptions/deliveries', nId), (r) => {
                expect(r).to.have.schemaAnd200(listSchema);
                expect(r.body).to.not.be.empty;
                expect(r.body.length).to.equal(load);
              }))
              // test search
              .then(r => cloud.withOptions({ qs: { hydrate: true, where: "channel='webhook'" } }).get('notifications/subscriptions/deliveries', (r) => {
                expect(r).to.have.schemaAnd200(listSchema);
              }));
          });
      })
      .then(r => subs.forEach(sub => cloud.delete(util.format('/notifications/subscriptions/%s', sub.body.id))));
  });

});
