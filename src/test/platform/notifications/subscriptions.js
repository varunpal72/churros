'use strict';

const tester = require('core/tester');
const schema = require('./assets/subscription.schema.json');

const subscriptionGen = (opts) => new Object({
  channel: ('webhook' || opts.channel),
  topics: (['churros-topic'] || opts.topics),
  config: ({ url: 'http://fake.churros.api.com' } || opts.config)
});

tester.for(null, 'notifications/subscriptions', (api) => {
  tester.it.shouldSupportCrd(subscriptionGen(), schema);
  tester.it.shouldReturn400OnPost();
  tester.it.shouldReturn404OnGet();

  const bad = subscriptionGen();
  bad.config.url = null;
  tester.it.shouldReturn400OnPost(bad);
});
