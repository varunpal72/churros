'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;

suite.forElement('finance', 'addresses', (test) => {
  let date = '2017-05-05';
  test.should.supportSr();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by lastModifiedDate`)
    .withOptions({ qs: { where: `lastModifiedDate >= '${date}'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.lastModifiedDate >= `${date}`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
