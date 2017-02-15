'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ email: tools.randomEmail() });

suite.forElement('marketing', 'leads', { payload: contactsPayload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');
});
