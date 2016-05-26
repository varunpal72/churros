'use strict';

const expect = require('chakram').expect;
const tools = require('core/tools');
const suite = require('core/suite');
const cloud = require('core/cloud');
const schema = require('./assets/notification.schema.json');
const pluralSchema = require('./assets/notifications.schema.json');

const genNotif = (opts) => new Object({
  severity: (opts.severity || 'low'),
  topic: (opts.topic || 'churros-topic'),
  message: (opts.message || 'this is a test message'),
  from: (opts.from || 'churros')
});

const opts = { payload: genNotif({}), schema: schema };

suite.forPlatform('notifications', opts, (test) => {
  test.should.supportCrd();
  test.should.return404OnGet(-1);
  test
    .withJson({})
    .should.return400OnPost();

  const a = genNotif({ topic: 'pagination-topic' });
  test
    .withOptions({ qs: { 'topics[]': a.topic } })
    .withJson(a)
    .should.supportNextPagePagination(5, true);

  // test with missing topic should be bad too
  const n = genNotif({});
  n.topic = null;
  test.withJson(n).should.return400OnPost();

  it('should return one notification when searching for this topic', () => {
    const n = genNotif({ topic: 'churros-topic-' + tools.random() });

    return cloud.post(test.api, n, schema)
      .then(r => {
        const options = { qs: { 'topics[]': n.topic } };
        return cloud.withOptions(options).get(test.api, (r) => {
          expect(r).to.have.schemaAnd200(pluralSchema);
          expect(r.body).to.not.be.empty;
          expect(r.body.length).to.equal(1);
        });
      })
      .then(r => cloud.delete(`${test.api}/${r.body[0].id}`));
  });

  it('should allow acknowledging a notification', () => {
    const n = genNotif({});

    return cloud.post(test.api, n, (r) => {
        expect(r).to.have.schemaAnd200(schema);
        expect(r.body.acknowledged).to.equal(false);
      })
      .then(r => {
        const url = `${test.api}/${r.body.id}/acknowledge`;
        return cloud.put(url, schema, (r) => {
          expect(r).to.have.statusCode(200);
          expect(r.body).to.not.be.empty;
          expect(r.body.acknowledged).to.equal(true);
        });
      })
      .then(r => cloud.delete(test.api + '/' + r.body.id));
  });

  test
    .withName('should return an empty array if no notifications are found with the given topic')
    .withOptions({ qs: { 'topics[]': 'fake-topic-name-with-no-notifications' } })
    .withValidation((r) => expect(r.body).to.be.empty)
    .should.return200OnGet();

  it('should throw a 400 if missing search query', () => cloud.get(test.api, (r) => expect(r).to.have.statusCode(400)));
});
