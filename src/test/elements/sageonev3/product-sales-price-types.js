'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');


suite.forElement('finance', 'product-sales-price-types', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  it(`should support GET ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => {
        if (r.body.length <= 0) {
          return;
        }
        test
          .withName(`should support searching ${test.api} by active`)
          .withOptions({ qs: { where: `active ='true'` } })
          .withValidation((r) => {
            expect(r).to.have.statusCode(200);
            const validValues = r.body.filter(obj => obj.active === `true`);
            expect(validValues.length).to.equal(r.body.length);
          }).should.return200OnGet();
      });
  });
});
