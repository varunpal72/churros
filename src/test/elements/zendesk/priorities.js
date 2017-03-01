'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const updatePayload = () => ({
  "raw_description":"test update"
});

suite.forElement('helpdesk', 'priorities', null , (test) => {
  test.should.supportPagination();
  it(`should allow GET and PATCH for ${test.api}`, () => {
    let priorityId;
    return cloud.get(test.api)
    .then(r => priorityId = r.body[0].id)
    .then(r => cloud.get(`${test.api}/${priorityId}`))
    .then(r => cloud.patch(`${test.api}/${priorityId}`,updatePayload()));
  });
});
