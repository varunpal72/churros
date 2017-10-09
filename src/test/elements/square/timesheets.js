'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const timeSheetPayload = tools.requirePayload(`${__dirname}/assets/timesheet.json`);
const timeSheetUpdatePayload = tools.requirePayload(`${__dirname}/assets/timeSheetUpdate.json`);

suite.forElement('employee', 'timesheets', (test) => {

    test.should.supportPagination();
    test.withOptions({ qs: { where: "employee_id='APP5JTYW917TW' and deleted='false' and begin_updated_at='2017-10-01T17:49:02Z' and end_updated_at='2017-10-04T17:49:02Z' and begin_clockin_time='1998-11-15T09:00:00Z' and end_clockin_time='2000-11-15T09:00:00Z' and begin_clockout_time='2015-11-15T16:00:00Z' and end_clockout_time='2016-11-15T16:00:00Z'" } }).should.return200OnGet();


    it('should allow CRUD for timesheets', () => {
      let id = 'H3S8944HEAMBY';
      let tsId = 'RKEZB20KJKVTQ';

      return cloud.get(test.api)
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.post(`${test.api}`, timeSheetPayload))
      .then(r => cloud.patch(`${test.api}/${tsId}`, timeSheetUpdatePayload));
    });
});
