'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/customers.json`);
const chakram = require('chakram');

suite.forElement('finance', 'customers', { payload: payload }, (test) => {
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
