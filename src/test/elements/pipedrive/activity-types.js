'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/activity-types');

suite.forElement('crm', 'activity-types', { payload: payload }, (test) => {

  const updatePayload = {
    "color": "FFFFFF"
  };

  let id;
  test.should.supportPagination();
  it(`should allow CUDS for ${test.api}`, () => {
    return cloud.post(`${test.api}`, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.put(`${test.api}/${id}`, updatePayload))
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.delete(`${test.api}/${id}`))
      .then(r => cloud.post(`${test.api}`, payload))
      .then(r => id = r.body.id)
      .then(r => cloud.withOptions({ qs: { ids: `${id}` } }).delete(`${test.api}`));
  });
});
