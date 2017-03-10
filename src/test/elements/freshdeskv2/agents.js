'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const expect = chakram.expect;

suite.forElement('helpdesk', 'agents', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by email`)
    .withOptions({ qs: { where: 'email=\'freshdesk@cloud-elements.com\'' } })
    .withValidation((r) => expect(r.body).to.not.be.empty)
    .should.return200OnGet();
});
