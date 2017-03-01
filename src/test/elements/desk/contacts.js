'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const chakram = require('chakram');
const expect = chakram.expect;

const contactUpdate = () => ({
  "first_name": "test",
  "last_name": "cloud"
});

const options = {
  churros: { updatePayload: contactUpdate() },
  skip: true // Skipping since we cannot delete contacts
};

suite.forElement('helpdesk', 'contacts', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCrus();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by email`)
    .withOptions({ qs: { where: 'email=\'support@desk.com\'' } })
    .withValidation((r) => expect(r.body).to.not.be.empty)
    .should.return200OnGet();
  test
    .withName(`should not support searching ${test.api} by updated_at using equals`)
    .withOptions({ qs: { where: 'updated_at=\'2015-10-22T16:40:10Z\'' } })
    .withValidation((r) => expect(r).to.have.statusCode(400))
    .should.return200OnGet();
});
