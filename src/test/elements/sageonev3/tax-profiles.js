'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');

suite.forElement('finance', 'tax-profiles',{skip : true}, (test) => {
  let reference = "INV000mm1",id;
  it(`should support GET ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => {
        if (r.body.length <= 0) {
          return;
        }
        id = r.body[0].id;
        test
          .withName(`should support searching ${test.api} by reference`)
          .withOptions({ qs: { where: `attributes ='${id}'` } })
          .withValidation((r) => {
            expect(r).to.have.statusCode(200);
            const validValues = r.body.filter(obj => obj.reference === `${reference}`);
            expect(validValues.length).to.equal(r.body.length);
          }).should.return200OnGet();
        return cloud.get(`${test.api}/${id}`);
      });
  });
});
