'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const chakram = require('chakram');
const expect = chakram.expect;

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "Pers_LastName": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(2);
  test.should.supportCeqlSearch('Pers_PersonId');
  test.withName(`should support searching ${test.api} by contact first name`)
    .withOptions({ qs: { where: `Pers_FirstName ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Pers_FirstName = 'Test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
