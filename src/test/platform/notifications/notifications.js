'use strict';

const util = require('util');
const expect = require('chakram').expect;
const tools = require('core/tools');
const tester = require('core/tester');
const schema = require('./assets/notification.schema.json');

const genNotif = (opts) => new Object({
  severity: (opts.severity || 'low'),
  topic: (opts.topic || 'churros-topic'),
  message: (opts.message || 'this is a test message'),
  from: (opts.from || 'churros')
});

tester.forPlatform('notifications', genNotif({}), schema, (suite) => {
  suite.should.supportCrd();
  suite.should.return404OnGet();
  suite.withJson({}).should.return400OnPost();

  // test with missing topic should be bad too
  const n = genNotif({});
  n.topic = null;
  suite.withJson(n).should.return400OnPost();

  it('should return one notification when searching for this topic', () => {
    const n = genNotif({ topic: 'churros-topic-' + tools.random() });

    return tester.post(suite.api, n, schema)
      .then(r => {
        const options = { qs: { 'topics[]': n.topic } };
        return tester.find(suite.api, (r) => {
          expect(r).to.have.schemaAnd200(schema);
          expect(r.body).to.not.be.empty;
          expect(r.body.length).to.equal(1);
        }, options);
      })
      .then(r => tester.delete(suite.api + '/' + r.body[0].id));
  });

  it('should allow acknowledging a notification', () => {
    const n = genNotif({});

    return tester.post(suite.api, n, (r) => {
        expect(r).to.have.schemaAnd200(schema);
        expect(r.body.acknowledged).to.equal(false);
      })
      .then(r => {
        const url = util.format('%s/%s/acknowledge', suite.api, r.body.id);
        return tester.put(url, schema, (r) => {
          expect(r).to.have.statusCode(200);
          expect(r.body).to.not.be.empty;
          expect(r.body.acknowledged).to.equal(true);
        });
      })
      .then(r => tester.delete(suite.api + '/' + r.body.id));
  });

  it('should return an empty array if no notifications are found with the given topic', () => {
    const options = { qs: { 'topics[]': 'fake-topic-name-with-no-notifications' } };
    return tester.get(suite.api, (r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.be.empty;
    }, options);
  });

  it('should throw a 400 if missing search query', () => tester.get(suite.api, (r) => expect(r).to.have.statusCode(400)));
});
