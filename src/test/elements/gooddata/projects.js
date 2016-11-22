'use strict';

const suite = require('core/suite');
const payload = require('./assets/projects');
const cloud = require('core/cloud');

suite.forElement('db', 'projects', { payload: payload }, (test) => {
  test.withOptions({skip:true}).should.supportCruds();
  // get authenticated user info
  test.should.return200OnGet();

  it('should allow POST for /projects/{projectId}/report-definitions', () => {
    let reportDefinition = {

    };
    return cloud.get(test.api)
    .then(r => r.body[0].project.links.self.substr(14))
    .then(projectId => cloud.post(`${test.api}/${projectId}/reports`, reportDefinition));
  });

  it('should allow POST for /projects/{projectId}/reports', () => {
    let report = {};
    return cloud.get(test.api)
    .then(r => r.body[0].project.links.self.substr(14))
    .then(projectId => cloud.post(`${test.api}/${projectId}/reports`, report));
  });

  it('should allow GET for /projects/{projectId}/reports', () => {
    // let projectId = '';
    return cloud.get(test.api)
    .then(r => r.body[0].project.links.self.substr(14))
    .then(projectId => cloud.get(`${test.api}/${projectId}/reports`));
  });

  it('should allow PATCH for /projects/{projectId}/reports/json', () => {
    let projectId = '';
    let report_request = {
      "report_req": {
        "report": "/gdc/md/{project_id}/obj/{object_id}"
      }
    };
    return cloud.get(test.api)
    .then(r => projectId = r.body[0].project.links.self.substr(14))
    .then(() => cloud.get(`${test.api}/${projectId}/reports`))
    .then(r => report_request.report_req.report = r.body[0].link)
    .then(() => cloud.patch(`${test.api}/${projectId}/reports/json`, report_request));
  });

  // it('should allow GET for /projects/{projectId}/reports/{reportId}/export-json', () => {
  //   let projectId = '';
  //   let report_request = {
  //     "report_req": {
  //       "reportDefinition": "/gdc/md/{project_id}/obj/{object_id}"
  //     }
  //   };
  //   return cloud.get(test.api)
  //   .then(r => projectId = r.body[0].project.links.self.substr(14))
  //   .then(() => cloud.get(`${test.api}/${projectId}/reports`))
  //   .then(r => report_request = r.body[0].link)
  //   .then(() => cloud.patch(`${test.api}/${projectId}/reports-execute-json`, report_request))
  //   .then(r => r.uri.substr(r.uri.indexOf('?')))
  //   .then(reportId => cloud.get(`${test.api}/${projectId}/reports/${reportId}/export-json`));
  // });

  it('should allow PATCH for /projects/{projectId}/reports-execute-csv', () => {
    let projectId = '';
    let report_request = {
      "report_req": {
        "report": "/gdc/md/{project_id}/obj/{object_id}"
      }
    };
    return cloud.get(test.api)
    .then(r => projectId = r.body[0].project.links.self.substr(14))
    .then(() => cloud.get(`${test.api}/${projectId}/reports`))
    .then(r => report_request.report_req.report = r.body[0].link)
    .then(() => cloud.patch(`${test.api}/${projectId}/reports-execute-csv`, report_request));
  });

  // it('should allow GET for /projects/{projectId}/reports/{reportId}/export-csv', () => {
  //   let projectId = '';
  //   let report_request = {
  //     "report_req": {
  //       "reportDefinition": "/gdc/md/{project_id}/obj/{object_id}"
  //     }
  //   };
  //   return cloud.get(test.api)
  //   .then(r => projectId = r.body[0].project.links.self.substr(14))
  //   .then(() => cloud.get(`${test.api}/${projectId}/reports`))
  //   .then(r => report_request = r.body[0].link)
  //   .then(() => cloud.patch(`${test.api}/${projectId}/reports-execute-csv`, report_request))
  //   .then(r => r.execResult.dataResult.substr(r.execResult.dataResult.indexOf('dataResult/')))
  //   .then(reportId => cloud.get(`${test.api}/${projectId}/reports/${reportId}/export-csv`));
  // });

});
