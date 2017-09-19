'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/incidents');
const taskPayload = require('./assets/task');
const expect = require('chakram').expect;
const commentPayload = require('./assets/comments');

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {
  test.should.supportCrds();  //update is getting an 500 error from vendor
  test.should.supportPagination();

  it(`should allow C for ${test.api}/:id/comments`, () => {
    let id;
    return cloud.get(test.api)
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.be.above(1);
        id = r.body[0].id;
      })
      .then(r => cloud.post(`${test.api}/${id}/comments`, commentPayload));
  });

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

  it(`should allow pagination with page and 1000 pageSize for ${test.api}/:id/tasks`, () => {
    let id, taskId1, taskId2;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.post(`${test.api}/${id}/tasks`, taskPayload))
      .then(r => taskId1 = r.body.id)
      .then(r => cloud.post(`${test.api}/${id}/tasks`, taskPayload))
      .then(r => taskId2 = r.body.id)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1000 } }).get(`${test.api}/${id}/tasks`))
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.equal(2);
      })
      .then(r => cloud.withOptions({ qs: { page: 2, pageSize: 1000 } }).get(`${test.api}/${id}/tasks`))
      .then(r => expect(r.body).to.be.empty)
      .then(r => cloud.delete(`${test.api}/${id}/tasks/${taskId1}`))
      .then(r => cloud.delete(`${test.api}/${id}/tasks/${taskId2}`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });

});
