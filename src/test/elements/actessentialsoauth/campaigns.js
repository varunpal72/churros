'use strict';

const suite = require('core/suite');
const payload = {
  "senderEmailAddress": "lutherangrandmother@maildrop.cc",
  "groupId": "5805336f295c9107f80f1c50",
  "templateId": "86ef6cf7-670f-4b7e-9a93-74ecab529ae5",
  "emailSubject": "Churros Test Campaign",
  "sendDate": new Date(),
  "timeZone": "Mountain Standard Time"
};

suite.forElement('crm', 'campaigns', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.should.return200OnGet();
});