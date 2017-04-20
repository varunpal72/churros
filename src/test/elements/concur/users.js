'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;

suite.forElement('expense', 'users', null, (test) => {
  test.should.return200OnGet();
  test.should.supportNextPagePagination(1);
  test
    .withName(`should support searching ${test.api} by Active`)
    .withOptions({ qs: { where: 'active = \'true\'' } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Active === true);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

});
