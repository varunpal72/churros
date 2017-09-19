'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/problems');
const taskPayload = require('./assets/task');
const expect = require('chakram').expect;

suite.forElement('helpdesk', 'problems', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();

  it(`should allow CRUDS for ${test.api}/:id/tasks`, () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${id}/tasks`, taskPayload));
  });

  it(`should allow pagination with page and pageSize for ${test.api}/:id/tasks`, () => {
    let id, taskId1, taskId2;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.post(`${test.api}/${id}/tasks`, taskPayload))
      .then(r => taskId1 = r.body.id)
      .then(r => cloud.post(`${test.api}/${id}/tasks`, taskPayload))
      .then(r => taskId2 = r.body.id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${id}/tasks`))
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.be.below(2);
      })
      .then(r => cloud.withOptions({ qs: { page: 2, pageSize: 1 } }).get(`${test.api}/${id}/tasks`))
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.be.below(2);
      })
      .then(r => cloud.delete(`${test.api}/${id}/tasks/${taskId1}`))
      .then(r => cloud.delete(`${test.api}/${id}/tasks/${taskId2}`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
});
