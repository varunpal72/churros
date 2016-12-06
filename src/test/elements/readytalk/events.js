'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('general', 'meetings', null, (test) => {
it('should allow get for meetings and attendees ', () => {
    let meetingId,attendeesId;
    test.should.supportPagination();
    test.should.supportCeqlSearch('id');
    return cloud.withOptions({ qs:{where : "status ='ENDED'"}}).get(`${test.api}`)
      .then(r => meetingId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${meetingId}`))
      .then(r => cloud.get(`${test.api}/${meetingId}/attendees`))
      .then(r => attendeesId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${meetingId}/attendees/${attendeesId}/chats`))
      .then(r => cloud.get(`${test.api}/${meetingId}/attendees/${attendeesId}`));
 });
});
