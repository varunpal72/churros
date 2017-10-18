'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const timeSheetPayload = tools.requirePayload(`${__dirname}/assets/timesheet.json`);
const timeSheetUpdatePayload = tools.requirePayload(`${__dirname}/assets/timeSheetUpdate.json`);

suite.forElement('employee', 'timesheets', (test) => {

    test.should.supportPagination();
    test.withOptions({ qs: { where: "end_clockout_time='2016-11-15T16:00:00Z'" } }).should.return200OnGet();
    test.withOptions({ qs: { where: "employee_id='APP5JTYW917TW'" } }).should.return200OnGet();
    test.withOptions({ qs: { where: "deleted='false'" } }).should.return200OnGet();
    test.withOptions({ qs: { where: "begin_updated_at='2017-10-01T17:49:02Z'" } }).should.return200OnGet();
    test.withOptions({ qs: { where: "end_updated_at='2017-10-04T17:49:02Z'" } }).should.return200OnGet();
    test.withOptions({ qs: { where: "begin_clockin_time='1998-11-15T09:00:00Z'" } }).should.return200OnGet();
    test.withOptions({ qs: { where: "end_clockin_time='2000-11-15T09:00:00Z'" } }).should.return200OnGet();
    test.withOptions({ qs: { where: "begin_clockout_time='2015-11-15T16:00:00Z'" } }).should.return200OnGet();

    it('should allow CRU for timesheets', () => {

      let tsId, empId;

      return cloud.get(test.api)
       .then(r => { timeSheetPayload.employee_id = r.body[0].employee_id;
                    timeSheetUpdatePayload.employee_id = r.body[0].employee_id;
                  })
       .then(r => cloud.post(`${test.api}`, timeSheetPayload))
       .then(r => tsId = r.body.id)
       .then(r => cloud.get(`${test.api}/${tsId}`))
       .then(r => cloud.patch(`${test.api}/${tsId}`, timeSheetUpdatePayload));
    });
});
