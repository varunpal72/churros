'use strict';

const suite = require('core/suite');
const schema = require('./assets/subscription.schema.json');

const genSub = (opts) => new Object({
  channel: (opts.channel || 'webhook'),
  topics: (opts.topics || ['churros-topic']),
  config: (opts.config || { url: 'http://fake.churros.api.com' })
});

const opts = { payload: genSub({}), schema: schema };

suite.forPlatform('notifications/subscriptions', opts, (test) => {
  test.should.supportCrd();
  test.withJson({}).should.return400OnPost();
  test.should.return404OnGet(-1);

  const bad = genSub({});
  bad.config.url = null;
  test.withJson(bad).should.return400OnPost(bad);
});
