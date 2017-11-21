'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/placments');
const updatePayload = {};

suite.forElement('crm', 'placements', { payload: payload }, (test) => {
  it('should support CRUDS for placements', () => {
    let placementId;
    return cloud.post(test.api, payload)
      .then(r => placementId = r.body.changedEntityId)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${placementId}`))
      .then(r => cloud.patch(`${test.api}/${placementId}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${placementId}`));

  });
  test.should.supportPagination();
});

