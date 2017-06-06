'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/users.json`);
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('Humancapital', 'users', { payload: payload }, (test) => {
  // test.should.supportCruds();
  let id;
  it(`should allow CRUS for ${test.api}`, () => {
    return cloud.post(test.api, payload)
      .then(r => id = r.body.userId)
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.put(`${test.api}/${id}`, payload))
      .then(r => cloud.get(`${test.api}`));
  });
  it(`should allow CEQL search for ${test.api}`, () => {
    return cloud.withOptions({ qs: { where: `userId='${id}'` } }).get(test.api)
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.equal(1);
        expect(r.body[0].userId).to.equal(id);
      });
  });
  test.should.supportPagination();
  //test.should.supportNextPagePagination(2);
  //test.withOptions({ qs: { where: `begin_time = '2017-04-10T16:02:04Z' and state = 'active'` } }).should.return200OnGet();
  //test.withOptions({ qs: { orderBy: 'updated_at asc', pageSize: 5 } }).should.return200OnGet();
});
