'use strict';

const suite = require('core/suite');

suite.forElement('social', 'followers', { skip: true }, (test) => {
  test.withApi(`/hubs/social/companies/16238355/followers`).should.return200OnGet();
});
