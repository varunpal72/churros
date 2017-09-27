'use strict';
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/users');
const expect = require('chakram').expect;

suite.forElement('fsa', 'users', { payload: payload }, (test) => {
  beforeEach(() => {
    payload.email = tools.randomEmail();
    payload.firstName = tools.random();
  });
  test.should.supportCruds();
  test.should.supportPagination();

  it('support ceql searching', () => {
    let id;
    return cloud.post(test.api, payload)
    .then(r => id = r.body.id)
    .then(r => cloud.withOptions({ qs: { where: `firstName='${payload.firstName}'` } }).get(`${test.api}`))
    .then(r => {
      expect(r).to.have.statusCode(200);
      expect(r.body.filter(obj => obj.id === id).length).to.equal(r.body.length);
    })
    .then(r => cloud.delete(`${test.api}/${id}`))
  });
});
