'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

suite.forElement('documents', 'search', null, (test) => {
  test.withOptions({ qs: { text: tools.random() } }).should.return200OnGet();

  test.should.supportPagination();

  return cloud.GET(test.api)
    .then(r => cloud.withOptions({ qs: { startDate: '2015-06-15T09:15:04Z', endDate: '2015-06-15T09:40:04Z' } }).get(test.api))
    .expect(r).to.have.statusCode(200)
    .expect(r.body.length).to.equal(2);

  /*  test.withOptions({ qs: { startDate: '2015-06-15T09:15:04Z', endDate: '2015-06-15T09:40:04Z' } })
      .expect(r).to.have.statusCode(200)
      .expect(r.response.headers['elements-returned-count']).to.equal(2); */

  return cloud.GET(test.api)
    .then(r => cloud.withOptions({ qs: { path: '/' } }).get(test.api))
    .expect(r).to.have.statusCode(200);

  /*  test.withOptions({ qs: { path: '/' } })
      .expect(r).to.have.statusCode(200); */

  return cloud.GET(test.api)
    .then(r => cloud.withOptions({ qs: { path: '/Test folder' } }).get(test.api))
    .expect(r).to.have.statusCode(400);

  /* test.withOptions({ qs: { path: '/Test folder' } })
    .expect(r).to.have.statusCode(400); */
});
