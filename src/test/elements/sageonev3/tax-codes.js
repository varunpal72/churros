'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'tax-codes', { skip: true }, (test) => {
  let id;
  it(`should support GET ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => {
        if (r.body.length <= 0) {
          return;
        }
        id = r.body[0].id;
        test
          .withName(`should support searching ${test.api} by federal_tax`)
          .withOptions({ qs: { where: `attributes ='${federal_tax}'` } })
          .withValidation((r) => {
            expect(r).to.have.statusCode(200);
            const validValues = r.body.filter(obj => obj.reference === `${federal_tax}`);
            expect(validValues.length).to.equal(r.body.length);
          }).should.return200OnGet();
        return cloud.get(`${test.api}/${id}`)
      });
  });
});
