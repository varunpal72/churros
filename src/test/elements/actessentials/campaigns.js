'use strict';

const suite = require('core/suite');
const payload = {
  "senderEmailAddress": "lutherangrandmother@maildrop.cc",
  "groupId": "5805336f295c9107f80f1c50",
  "templateId": "86ef6cf7-670f-4b7e-9a93-74ecab529ae5",
  "emailSubject": "Churros Test Campaign",
  "sendDate": "2016-10-19T20:17:08.561Z",
  "timeZone": "Mountain Standard Time"
};

// const cloud = require('core/cloud');

suite.forElement('crm', 'campaigns', {payload: payload}, (test) => {
  test.should.supportPagination();
  // test get and get by ID
  test.should.supportSr();
  // need to update asset to functional campaign obj

});
