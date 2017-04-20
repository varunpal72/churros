'use strict';

const suite = require('core/suite');
const payload = require('./assets/expenses');
const expect = require('chakram').expect;
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const expensesPayload = build({ ReportOwnerID: tools.randomEmail() });

suite.forElement('expense', 'expenses', { payload: expensesPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "ReportOwnerID": tools.randomEmail()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportNextPagePagination(1);
  test
    .withName(`should support searching ${test.api} by isBillable`)
    .withOptions({ qs: { where: 'isBillable = \'false\'' } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.IsBillable === false);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
