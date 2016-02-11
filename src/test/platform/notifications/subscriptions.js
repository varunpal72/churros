'use strict';

const suite = require('core/suite');
const schema = require('./assets/subscription.schema.json');

const genSub = (opts) => new Object({
  channel: ('webhook' || opts.channel),
  topics: (['churros-topic'] || opts.topics),
  config: ({ url: 'http://fake.churros.api.com' } || opts.config)
});

suite.forPlatform('notifications/subscriptions', genSub({}), schema, (test) => {
  test.should.supportCrd();
  test.withJson({}).should.return400OnPost();
  test.should.return404OnGet();

  const bad = genSub();
  bad.config.url = null;
  test.withJson(bad).should.return400OnPost(bad);
});
