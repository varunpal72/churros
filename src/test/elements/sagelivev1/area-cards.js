'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('ecommerce', 'area-cards', (test) => {
  let id;
  test.should.supportPagination();
  it(`should support GET ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => {
        if (r.body.length <= 0) {
          return;
        } else {
          id = r.body[0].id;
          cloud.get(`${test.api}/${id}`);
        }
      });
  });
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === 'test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
