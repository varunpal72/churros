'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('marketing', 'meetings', null, (test) => {
  test.should.supportSr();
  test.withOptions({ qs: { page: 1, pageSize: 5}}).should.return200OnGet();

  it('should get all meetings and then get chats, registrations and surveys of the first meeting', () => {
    let meetingId;
    return cloud.get(test.api)
      .then(r => {
        expect(r.body.length).to.be.above(0);
        meetingId = r.body[0].id;
      })
      .then(r => cloud.get(`${test.api}/${meetingId}/chats`))
      .then(r => cloud.get(`${test.api}/${meetingId}/registrations`))
      .then(r => cloud.get(`${test.api}/${meetingId}/surveys`));
  });
});
