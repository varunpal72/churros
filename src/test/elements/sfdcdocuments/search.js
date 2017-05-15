'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

suite.forElement('documents', 'search', null, (test) => {
  test.withOptions({ qs: { text: tools.random() } }).should.return200OnGet();

  test.should.supportPagination();

  test.withOptions({ qs: { startDate: '2015-06-15T09:15:04Z', endDate: '2015-06-15T09:40:04Z' } })
    .should.return200OnGet()
    .expect(r).to.have.statusCode(200)
    .expect(r.response.headers['elements-returned-count']).to.equal(2);

  test.withOptions({ qs: { path: '/' } })
    .expect(r).to.have.statusCode(200);

  test.withOptions({ qs: { path: '/Test folder' } })
    .expect(r).to.have.statusCode(400);
});
