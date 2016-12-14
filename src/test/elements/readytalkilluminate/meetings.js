'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('conferencing', 'meetings', null, (test) => {
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
  it('should allow get for meetings and attendees ', () => {
    let meetingId, attendeesId;
    return cloud.withOptions({ qs: { where: "status ='ENDED'" } }).get(`${test.api}`)
      .then(r => meetingId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${meetingId}`))
      .then(r => cloud.get(`${test.api}/${meetingId}/attendees`))
      .then(r => attendeesId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${meetingId}/attendees/${attendeesId}/chats`))
      .then(r => cloud.get(`${test.api}/${meetingId}/attendees/${attendeesId}`));
  });
});