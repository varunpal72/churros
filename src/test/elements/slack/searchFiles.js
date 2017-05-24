'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const searchField = `query='awesome'`;

suite.forElement('collaboration', 'search-files', (test) => {
  test
    .withOptions({ qs: { 'where': searchField } })
    .withValidation((r) => expect(r.body).to.not.be.empty && expect(r).to.have.statusCode(200))
    .should.return200OnGet();
  test.withOptions({ qs: { 'where': searchField } }).should.supportPagination();
});
