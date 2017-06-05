'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/reports.json`);
const expect = require('chakram').expect;

suite.forElement('expense', 'reports', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "Name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCrus();
  test.should.supportNextPagePagination(2);
  test
    .withName(`should support searching ${test.api} by modifiedDateAfter`)
    .withOptions({ qs: { where: `modifiedDateAfter='2017-04-19T05:01:31.463'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.LastModifiedDate >= '2017-04-19T05:01:31.463');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
