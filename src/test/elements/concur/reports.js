'use strict';

const suite = require('core/suite');
const payload = require('./assets/reports');
const expect = require('chakram').expect;
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const reportsPayload = build({ Name: tools.random() });

suite.forElement('expense', 'reports', { payload: reportsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "Name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCrus();
  test.should.supportNextPagePagination(1);
  test
    .withName(`should support searching ${test.api} by modifiedDateAfter`)
    .withOptions({ qs: { where: `modifiedDateAfter='2017-04-19T05:01:31.463'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.LastModifiedDate >= '2017-04-19T05:01:31.463');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
