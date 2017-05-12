'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('finance', 'contact-allocations', (test) => {
  let date = '2017-05-05',id;
  // test.should.supportSr();
  test.should.supportPagination();
  it(`should support GET ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => {
        if (r.body.length <= 0) {
          return;
        }
        id = r.body[0].reference;
        test
          .withName(`should support searching ${test.api} by lastModifiedDate`)
          .withOptions({ qs: { where: `lastModifiedDate >= '${date}'` } })
          .withValidation((r) => {
            expect(r).to.have.statusCode(200);
            const validValues = r.body.filter(obj => obj.lastModifiedDate >= `${date}`);
            expect(validValues.length).to.equal(r.body.length);
          }).should.return200OnGet();
        return cloud.get(`${test.api}/${id}`)
      });
  });
});
