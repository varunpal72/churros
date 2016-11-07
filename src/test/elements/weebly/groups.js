'use strict';

const suite = require('core/suite');
const payload = require('./assets/groups');
const cloud = require('core/cloud');

const groupPatch = () => ({
  member_ids : [
    "1"
  ]
});

suite.forElement('ecommerce', 'groups', { payload: payload, skip: true }, (test) => {
  test.should.supportPagination();
  it('should allow CRUDS for /groups', () => {
    let groupId;
    return cloud.post(test.api, payload)
      .then(r => groupId = r.body.group_id)
      .then(r => cloud.get(test.api + '/' + groupId))
      .then(r => cloud.get(test.api + '?name = \'Churros Group\''))
      .then(r => cloud.patch(test.api + '/' + groupId, groupPatch()))
      .then(r => cloud.delete(test.api + '/' + groupId));
  });
});
