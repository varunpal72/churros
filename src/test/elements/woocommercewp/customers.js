'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const expect= require('chakram').expect;
const payload = require('./assets/customers');
const build = (overrides) => Object.assign({}, payload, overrides);
const customersPayload = build({ last_name: tools.random(), first_name: tools.random(), username: tools.random(), email: tools.randomEmail() });

suite.forElement('ecommerce', 'customers', { payload: customersPayload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { pageSize: 1, page: 1 }}).withValidation((r) => { expect(r).to.have.statusCode(200);
                                                                           expect(r.body).to.have.lengthOf(1); }).should.return200OnGet();
  test.withOptions({ qs: { where: 'email = \'john.doe@gmail.com\'' } }).should.return200OnGet();
});
