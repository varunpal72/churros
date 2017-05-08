'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('ecommerce', 'auto-number-settings', (test) => {
  let name;
    test.should.supportPagination();
    test.should.supportSr();
    it('should support GET ${test.api}', () => {
      return cloud.get(test.api)
        .then(r => name = r.body[0].DeveloperName);
      });
       test
        .withName(`should support searching ${test.api} by DeveloperName`)
        .withOptions({ qs: { where:`DeveloperName='${name}'`} })
        .withValidation((r) => {
        expect(r).to.have.statusCode(200);
        const validValues = r.body.filter(obj => obj.DeveloperName === '${name}');
        expect(validValues.length).to.equal(r.body.length);
      }).should.return200OnGet();
});
