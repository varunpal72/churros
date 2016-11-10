'use strict';

const suite = require('core/suite');
const payload = require('./assets/statuses');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const tweetsPayload = build({ status: tools.random() });

suite.forElement('social', 'statuses', { payload: tweetsPayload }, (test) => {
  test.withOptions({ qs: { where: 'q = \'Jurgen Klopp\'', page: 1, pageSize: 1 } }).should.return200OnGet();
  test.should.supportCrd();
});
