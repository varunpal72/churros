'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/accounts.json`);
const chakram = require('chakram');
const expect = chakram.expect;

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "comp_name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(2);
  test.should.supportCeqlSearch('Comp_CompanyId');
  test.withName(`should support searching ${test.api} by company Name`)
    .withOptions({ qs: { where: `Comp_Name ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Comp_Name = 'Test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
