'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;

suite.forElement('finance', 'payment-methods', (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by show_legacy_id`)
    .withOptions({ qs: { where: `show_legacy_id='true'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
    }).should.return200OnGet();
});
