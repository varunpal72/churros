'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;

suite.forElement('crm', 'users', null, (test) => {
  test.should.supportSr();
  test.should.supportNextPagePagination(1);
  test.withName(`should support searching ${test.api} by  User Title`)
    .withOptions({ qs: { where: `user_title ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.user_title = 'Test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
