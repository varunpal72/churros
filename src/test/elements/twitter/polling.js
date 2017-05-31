'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const listsPayload = tools.requirePayload(`${__dirname}/assets/lists.json`);
// const statusesPayload = tools.requirePayload(`${__dirname}/assets/statuses.json`);

suite.forElement('social', 'polling', null, (test) => {
  test.withApi('/hubs/social/lists').should.supportPolling(listsPayload, 'lists');
  // Statuses don't appear to be working, ticket is in. Uncomment when done
  // test.withApi('/hubs/social/statuses').should.supportPolling(statusesPayload, 'statuses');
});
