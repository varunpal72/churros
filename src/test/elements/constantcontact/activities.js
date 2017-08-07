'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const chakram = require('chakram');
const payload = tools.requirePayload(`${__dirname}/assets/activities.json`);
const Upadtedpayload = tools.requirePayload(`${__dirname}/assets/activities.json`);
const cloud = require('core/cloud');

suite.forElement('marketing', 'activities', { payload: payload }, (test) => {


  test.should.supportNextPagePagination(1);

  it(`should allow CRUDS + ${test.api}`, () => {
    let id;
    return cloud.post(`${test.api}`, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.put(`${test.api}/${id}`,Upadtedpayload))
      .then(r => cloud.patch(`${test.api}/${id}`))
      .then(r => cloud.delete(`${test.api}/${id}`))
  });


it(`should allow CRUDS + ${test.api}/registrants`, () => {
    let id;
    return cloud.post(`${test.api}`, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${id}/registrants`)) 
      .then(r => {
      if (r.body.length <= 0) {
        return;
      } else {
        rId = r.body[0].id;
        return cloud.get(`${test.api}/${id}/registrants/${rId}`);
      }
    })
      .then(r => cloud.patch(`${test.api}/${id}`))
      .then(r => cloud.delete(`${test.api}/${id}`))
  });

});
