'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;

suite.forElement('ecommerce', 'auto-number-settings', (test) => {
  test.should.supportPagination();
  test.should.supportSr();
  test
    .withName(`should support searching ${test.api} by DeveloperName`)
    .withOptions({ qs: { where: `DeveloperName  ='test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.DeveloperName === 'test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  });
