'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const tools = require('core/tools');
const chakram = require('chakram');
const expect = require('chakram').expect;
const build = (overrides) => Object.assign({}, payload, overrides);
const accountPayload = build({ comp_name: tools.random() });

suite.forElement('crm', 'accounts', { payload: accountPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "comp_name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(1);
  test.should.supportCeqlSearch('Comp_CompanyId');
  test.withName(`should support searching ${test.api} by company Name`)
    .withOptions({ qs: { where: `Comp_Name ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Comp_Name = 'Test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

});
