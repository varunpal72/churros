'use strict';

const tester = require('core/tester');
const schema = require('./assets/subscription.schema.json');

const genSub = (opts) => new Object({
  channel: ('webhook' || opts.channel),
  topics: (['churros-topic'] || opts.topics),
  config: ({ url: 'http://fake.churros.api.com' } || opts.config)
});

tester.forPlatform('notifications/subscriptions', genSub({}), schema, (suite) => {
  suite.should.supportCrd();
  suite.withJson({}).should.return400OnPost();
  suite.should.return404OnGet();

  const bad = genSub();
  bad.config.url = null;
  suite.withJson(bad).should.return400OnPost(bad);
});
