'use strict';

const suite = require('core/suite');
const payload = require('./assets/projects');
const cloud = require('core/cloud');

suite.forElement('db', 'projects', { payload: payload }, (test) => {
  // get authenticated user info
  test.should.return200OnGet();

  it('should support GET for all reports in a project', () => {
    // let projectId = '';
    return cloud.get(test.api)
    .then(r => r.body[0].project.links.self.substr(14))
    .then(projectId => cloud.get(`${test.api}/${projectId}/reports`));
  });

  it('should support POST for /projects/{projectId}/reports-execute-json', () => {
    let projectId = '';
    let report_request = {};
    return cloud.get(test.api)
    .then(r => projectId = r.body[0].project.links.self.substr(14))
    .then(() => cloud.get(`${test.api}/${projectId}/reports`))
    .then(r => r.body[0].link)
    .then(reportId => cloud.post(`${test.api}/${projectId}/reports-execute-json`, report_request));
  });

});
