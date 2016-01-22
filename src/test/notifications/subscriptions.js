'use strict';

const tester = require('core/tester');
const schema = require('./assets/subscription.schema');

const gen = (opts) => new Object({
  channel: ('webhook' || opts.channel),
  topics: (['churros-topic'] || opts.topics),
  config: ({
    url: 'http://fake.churros.api.com'
  } || opts.config)
});

tester.for(null, 'notifications/subscriptions', (api) => {
  tester.testCrd(api, gen(), schema);
  tester.testBadPost400(api);
  tester.testBadGet404(api);

  const bad = gen();
  bad.config.url = null;
  tester.testBadPost400(api, bad);
});
