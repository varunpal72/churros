'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const payload = require('./assets/customers');
const chakram = require('chakram');
const build = (overrides) => Object.assign({}, payload, overrides);
const customersPayload = build({ name: "ce" + tools.randomInt(), reference: "re" + tools.randomInt(), notes: "notes" + tools.randomInt() });

suite.forElement('finance', 'customers', { payload: customersPayload }, (test) => {
  test.should.supportCrus(chakram.put);
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by search`)
    .withOptions({ qs: { where: `search='test123'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.name === 'test123');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

});
