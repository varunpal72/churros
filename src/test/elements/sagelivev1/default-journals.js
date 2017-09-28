'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const defaultJournalsPayload = tools.requirePayload(`${__dirname}/assets/default-journals.json`);

suite.forElement('finance', 'default-journals', { payload: defaultJournalsPayload, skip: true }, (test) => {
  let number = "0050Y00" + Math.random(10).toPrecision(3).replace("\.", "") + "dA1YQAU";
  defaultJournalsPayload.SetupOwnerId = number;
  test.should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === `Test`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
