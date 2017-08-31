'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/shares.json`);

suite.forElement('social', 'user/me', { payload: payload, skip: true }, (test) => {
  test.withOptions({ qs: { language: `en_US` } }).should.return200OnGet();
  test.withApi(`${test.api}/detailed`).withOptions({ qs: { language: `en_US` } }).should.return200OnGet();
  test.withApi(`${test.api}/shares`).should.return200OnPost();
});
