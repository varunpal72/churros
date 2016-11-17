// 'use strict';
//
// const suite = require('core/suite');
// const payload = require('./assets/reports');
// const cloud = require('core/cloud');
//
// const projectId = '{projectId}';
//
// suite.forElement('db', 'projects/' + projectId + '/reports', { payload: payload }, (test) => {
//   cloud.get('/hubs/db/users')
//   .then(r => console.log(r));
//   // get all reports
//   test.should.return200OnGet();
//   // execute particular report in JSON
//   // it('should execute report for JSON data', () => {
//   //   return cloud.get('/projects/{projectId}/reports')
//   //   .then(r => cloud.patch('/projects/{projectId}/reports-execute-json', {payload: {req_report: {reportDefinition: 'someIDHash'}}}));
//   // });
//
//   // execute particular report in CSV
//
//   // retrieve JSON payload from
//
// });
