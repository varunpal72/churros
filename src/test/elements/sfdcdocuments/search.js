'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const expect = require('chakram').expect;

suite.forElement('documents', 'search', null, (test) => {
  test.withOptions({ qs: { text: tools.random() } }).should.return200OnGet();

  test.should.supportPagination();

  test.withOptions({ qs: { path: '/' } })
    .should.return200OnGet();

  test.withOptions({ qs: { startDate: '2015-06-15T09:15:04Z', endDate: '2015-06-15T09:40:04Z' } })
    .should.return200OnGet();

  test.withOptions({ qs: { path: '/Test folder' } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(400);
    });
});
