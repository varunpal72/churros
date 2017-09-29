'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;

suite.forElement('finance', 'year-end-process-configs', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by DeveloperName`)
    .withOptions({ qs: { where: `DeveloperName='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.DeveloperName === 'Test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
