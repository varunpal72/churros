'use strict';

const suite = require('core/suite');
const moment = require('moment');
const payload = {
   "ActivityFunctionCode" : "APPOINTMENT",
    "ActivityStartDate" : "2017-02-09T13:00:00+07:00",
    "ActivityEndDate" : "2017-02-09T14:00:00+07:00",
    "Subject" : "Fancy 2 activity"
};
let now = moment().add(1, 'd').format('YYYY-MM-DD');

payload.ActivityStartDate =  now + 'T' + payload.ActivityStartDate.split('T')[1];
payload.ActivityEndDate = now + 'T' + payload.ActivityEndDate.split('T')[1];

suite.forElement('crm', 'activities', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('LastName');
});
